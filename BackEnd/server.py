import os
import sys
import asyncio
import logging
from fastapi import FastAPI, HTTPException, Depends, status, Form, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from jose import jwt, JWTError
import bcrypt
import logging.config
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import shutil
from pathlib import Path
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
import importlib.util
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# --- Model Imports ---
from app.models.user import User as UserModel
from app.models.chat import UserQuestion
from app.models.system import SystemConfig as SystemConfigModel
from app.models.knowledge import KnowledgeFile as KnowledgeFileModel, IngestionStatus
from app.core.database import Base, engine, SessionLocal

# --- Agno Imports ---
from agno.models.ollama import Ollama
from agno.agent import Agent

# --- Pydantic Schema Imports ---
from app.schemas.user import UserCreate, User, UserLogin, UserUpdateAdmin
from app.schemas.system import SystemConfigUpdate, SystemConfigResponse
from app.schemas.chat import ChatRequest
from app.schemas.knowledge import KnowledgeFile as KnowledgeFileSchema

# --- Logging Setup ---
logger = logging.getLogger(__name__)
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format='%(asctime)s - %(levelname)s - %(name)s - %(message)s')

# --- App Constants ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
AGENT_DIR = Path("app/agents")

# --- App Initialization ---
app = FastAPI(title="Genie AI Platform", version="2.0.0")
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"],
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# --- Dependencies & Security ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

security = HTTPBearer()

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user = session.query(UserModel).filter(UserModel.username == payload.get("sub")).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

def get_admin_user(user: UserModel = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# --- Core API Logic ---
def get_financial_agent(db: Session = Depends(get_db)) -> Optional[Agent]:
    """
    Loads the single Financial Advisor agent.
    """
    logger.info("Loading Financial Advisor agent.")
    agent_file = AGENT_DIR / "financial_advisor.py"
    
    if not agent_file.exists():
        logger.error("Financial advisor agent file not found.")
        return None

    try:
        module_name = agent_file.stem
        spec = importlib.util.spec_from_file_location(module_name, agent_file)
        agent_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(agent_module)

        if hasattr(agent_module, "get_agent"):
            agent = agent_module.get_agent()
            logger.info(f"Loaded agent '{agent.name}'.")
            return agent
    except Exception as e:
        logger.error(f"Failed to load agent from {agent_file.name}: {e}", exc_info=True)
    
    return None

# --- API Endpoints ---
@app.post("/api/auth/login")
def login(username: str = Form(...), password: str = Form(...), session: Session = Depends(get_db)):
    logger.info(f"Login attempt for user: {username}")
    user = session.query(UserModel).filter(UserModel.username == username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        return {
            "access_token": create_access_token({"sub": user.username, "email": user.email, "is_admin": user.is_admin, "id": user.id}),
            "token_type": "bearer"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/users/me", response_model=User)
def get_me(user: UserModel = Depends(get_current_user)):
    return user

@app.post("/api/ask", response_model=dict)
async def ask_question(
    request: ChatRequest, 
    financial_agent: Optional[Agent] = Depends(get_financial_agent), 
    current_user: UserModel = Depends(get_current_user)
):
    try:
        if not financial_agent:
            raise HTTPException(status_code=503, detail="The Financial Advisor agent is not available. Please check the server configuration.")

        # Directly run the financial agent
        response_obj = financial_agent.run(request.message)
        logger.info(f"Agent '{financial_agent.name}' responded to the user.")
        
        if hasattr(response_obj, 'content'):
            response = response_obj.content
        else:
            response = str(response_obj)

        return {"response": response}
    except Exception as e:
        logger.error(f"Error processing question: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get a response from the agent: {e}")

@app.post("/api/auth/register", response_model=User, status_code=201)
def register_user(user: UserCreate, session: Session = Depends(get_db)):
    db_user = session.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = session.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    # Manually add the missing field to satisfy the response model
    user_response = User.model_validate(db_user)
    user_response.chat_requests_count = 0
    
    return user_response

@app.get("/api/admin/config", response_model=List[SystemConfigResponse])
def get_system_config(admin: User = Depends(get_admin_user), session: Session = Depends(get_db)):
    return session.query(SystemConfigModel).all()

@app.post("/api/admin/config", response_model=SystemConfigResponse)
def update_system_config(config_update: SystemConfigUpdate, admin: User = Depends(get_admin_user), session: Session = Depends(get_db)):
    config_item = session.query(SystemConfigModel).filter(SystemConfigModel.key == config_update.key).first()
    if config_item:
        config_item.value = config_update.value
        session.commit()
        session.refresh(config_item)
        return config_item
    else:
        new_config = SystemConfigModel(key=config_update.key, value=config_update.value)
        session.add(new_config)
        session.commit()
        session.refresh(new_config)
        return new_config

@app.get("/api/admin/users", response_model=List[User])
def list_users(admin: User = Depends(get_admin_user), session: Session = Depends(get_db)):
    users = session.query(
        UserModel,
        func.count(UserQuestion.id).label("chat_requests_count")
    ).outerjoin(UserQuestion, UserModel.id == UserQuestion.user_id)\
     .group_by(UserModel.id)\
     .all()

    user_responses = []
    for user, count in users:
        user_data = user.__dict__
        user_data['chat_requests_count'] = count
        user_responses.append(User.model_validate(user_data))
        
    return user_responses

@app.patch("/api/admin/users/{user_id}", response_model=User)
def update_user_by_admin(
    user_id: int,
    user_update: UserUpdateAdmin,
    admin: User = Depends(get_admin_user),
    session: Session = Depends(get_db)
):
    user = session.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/api/admin/users/{user_id}", response_model=User)
def read_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    session: Session = Depends(get_db)
):
    user = session.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/api/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, current_user: User = Depends(get_admin_user), session: Session = Depends(get_db)):
    user = session.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()

@app.post("/api/admin/knowledge/upload", status_code=200)
async def upload_knowledge_file(
    admin: UserModel = Depends(get_admin_user),
    file: UploadFile = File(...),
    agent: Agent = Depends(get_financial_agent),
    db: Session = Depends(get_db)
):
    """
    Handles uploading of knowledge files, tracks them in the database,
    and triggers the knowledge base ingestion process.
    """
    if not agent:
        raise HTTPException(status_code=503, detail="Financial agent is not available. Cannot process file.")
        
    logger.info(f"Knowledge base received a new resource: {file.filename}")
    
    # Check if file already exists
    if db.query(KnowledgeFileModel).filter(KnowledgeFileModel.filename == file.filename).first():
        raise HTTPException(status_code=409, detail=f"File '{file.filename}' already exists.")

    upload_dir = Path("tmp/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename
    
    try:
        # Create DB record first
        db_file = KnowledgeFileModel(filename=file.filename, status=IngestionStatus.PROCESSING)
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Successfully uploaded file: {file.filename}")

        asyncio.create_task(load_and_recreate_knowledge(agent, db_file.id, db_file.filename, db))

        return {"filename": file.filename, "message": "File uploaded and is now being processed."}
    except Exception as e:
        logger.error(f"Failed to save or process uploaded file {file.filename}: {e}", exc_info=True)
        # Rollback DB change if something went wrong after the record was created
        if 'db_file' in locals():
            db.delete(db_file)
            db.commit()
        raise HTTPException(status_code=500, detail=f"Could not process file: {e}")

async def load_and_recreate_knowledge(agent: Agent, file_id: int, filename: str, db: Session):
    """
    Asynchronously loads knowledge and updates the file's status in the DB.
    """
    logger.info(f"Server is now parsing '{filename}' for consumption as knowledge for the agent.")
    try:
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, agent.knowledge.load, True)
        
        # Update status to INGESTED on success
        if file_id > 0:
            db_file = db.query(KnowledgeFileModel).filter(KnowledgeFileModel.id == file_id).first()
            if db_file:
                db_file.status = IngestionStatus.INGESTED
                db.commit()
        logger.info(f"Successfully parsed and added '{filename}' to the knowledge base.")
    except Exception as e:
        logger.error(f"Failed to parse and load knowledge from '{filename}': {e}", exc_info=True)
        # Update status to FAILED on error
        if file_id > 0:
            db_file = db.query(KnowledgeFileModel).filter(KnowledgeFileModel.id == file_id).first()
            if db_file:
                db_file.status = IngestionStatus.FAILED
                db.commit()

@app.get("/api/admin/knowledge/files", response_model=List[KnowledgeFileSchema])
def get_knowledge_files(admin: UserModel = Depends(get_admin_user), db: Session = Depends(get_db)):
    """
    Returns a list of all uploaded knowledge base files and their status.
    """
    return db.query(KnowledgeFileModel).all()

@app.delete("/api/admin/knowledge/files/{file_id}", status_code=200)
async def delete_knowledge_file(
    file_id: int,
    admin: UserModel = Depends(get_admin_user),
    agent: Agent = Depends(get_financial_agent),
    db: Session = Depends(get_db)
):
    """
    Deletes a knowledge file from disk and the database, then triggers a
    knowledge base rebuild.
    """
    if not agent:
        raise HTTPException(status_code=503, detail="Financial agent is not available. Cannot rebuild knowledge base.")

    db_file = db.query(KnowledgeFileModel).filter(KnowledgeFileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = Path("tmp/uploads") / db_file.filename
    
    try:
        # 1. Delete the physical file
        if file_path.exists():
            os.remove(file_path)
            logger.info(f"Deleted knowledge file from disk: {db_file.filename}")
        
        # 2. Delete the record from the database
        filename = db_file.filename
        db.delete(db_file)
        db.commit()

        # 3. Trigger a knowledge base rebuild asynchronously
        logger.info(f"Triggering knowledge base rebuild after deleting {filename}.")
        asyncio.create_task(load_and_recreate_knowledge(agent, 0, "all files", db)) # Pass a dummy ID

        return {"message": f"File '{filename}' deleted and knowledge base is being updated."}
    except Exception as e:
        logger.error(f"Failed to delete knowledge file {db_file.filename}: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Could not delete file: {e}")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application.")
    # Create database tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    # Make sure the agent directory exists
    AGENT_DIR.mkdir(parents=True, exist_ok=True)
    (AGENT_DIR / "__init__.py").touch(exist_ok=True)
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000, 
        reload=True,
        reload_dirs=[os.path.dirname(os.path.abspath(__file__))],
        reload_excludes=["app/agents/*"]
    )