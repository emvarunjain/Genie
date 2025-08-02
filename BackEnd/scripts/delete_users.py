import sys
import os
from sqlalchemy.orm import Session

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.chat import UserQuestion

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Construct the absolute path for the database file
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'agno_server.db'))
db_url = f"sqlite:///{db_path}"

# Create a new engine and session for this script
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def delete_non_admin_users():
    db: Session = SessionLocal()
    try:
        users_to_delete = db.query(User).filter(User.is_admin == False).all()
        
        if not users_to_delete:
            print("No non-admin users found to delete.")
            return

        num_deleted = 0
        for user in users_to_delete:
            print(f"Deleting user: {user.username} (ID: {user.id})")
            db.delete(user)
            num_deleted += 1
        
        db.commit()
        print(f"Successfully deleted {num_deleted} non-admin users.")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    delete_non_admin_users() 