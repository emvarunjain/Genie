import os
from pathlib import Path
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.knowledge.combined import CombinedKnowledgeBase
from agno.knowledge.pdf import PDFKnowledgeBase
from agno.knowledge.docx import DocxKnowledgeBase
from agno.knowledge.text import TextKnowledgeBase
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.embedder.ollama import OllamaEmbedder
from agno.tools.yfinance import YFinanceTools
from agno.storage.sqlite import SqliteStorage
from agno.memory.v2.db.sqlite import SqliteMemoryDb
from agno.memory.v2.memory import Memory

def get_agent() -> Agent:
    """
    Configures and returns the Financial Advisor agent with a knowledge base,
    reasoning tools, and enhanced memory.
    """
    agent_name = "Financial Advisor"
    
    # Ensure tmp directory for databases and uploads exists
    os.makedirs("tmp/uploads", exist_ok=True)
    
    upload_path = Path("tmp/uploads")
    lancedb_uri = "tmp/lancedb"
    embedder = OllamaEmbedder(id="mxbai-embed-large", host="http://localhost:11434", dimensions=1024)
    
    # 1. Knowledge Base from local directory using CombinedKnowledgeBase
    knowledge = CombinedKnowledgeBase(
        sources=[
            PDFKnowledgeBase(
                path=upload_path,
                vector_db=LanceDb(uri=lancedb_uri, table_name="local_docs_pdf", search_type=SearchType.hybrid, embedder=embedder)
            ),
            DocxKnowledgeBase(
                path=upload_path,
                vector_db=LanceDb(uri=lancedb_uri, table_name="local_docs_docx", search_type=SearchType.hybrid, embedder=embedder)
            ),
            TextKnowledgeBase(
                path=upload_path,
                vector_db=LanceDb(uri=lancedb_uri, table_name="local_docs_txt", search_type=SearchType.hybrid, embedder=embedder)
            ),
        ],
        vector_db=LanceDb(uri=lancedb_uri, table_name="local_docs_combined", search_type=SearchType.hybrid, embedder=embedder)
    )

    # 2. Storage for agent sessions
    storage = SqliteStorage(table_name="agent_sessions", db_file="tmp/agent.db")

    # 3. Enhanced Memory
    memory = Memory(
        # Use Ollama for creating and managing memories
        model=Ollama(id="mistral", host="http://localhost:11434"),
        # Store memories in a SQLite database
        db=SqliteMemoryDb(table_name="user_memories", db_file="tmp/agent.db"),
        # Enable memory management
        delete_memories=True,
        clear_memories=True,
    )

    # 4. Merged Instructions
    instructions = [
        "You are a sharp, data-driven financial analyst.",
        "Never mention that you are an AI. You are a human expert.",
        "Search your knowledge before answering any questions.",
        "do not search for internet for information. use only your knowledge base",
        "Provide only the final, user-facing answer. No other text, internal monologue, or reasoning.",
    ]

    # 5. The enhanced agent
    return Agent(
        name=agent_name,
        description="Expert financial advisor with reasoning, knowledge, and memory capabilities.",
        model=Ollama(id="mistral", host="http://localhost:11434"),
        instructions=instructions,
        knowledge=knowledge,
        tools=[
            YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True),
        ],
        storage=storage,
        memory=memory,
        # History and Memory settings from snippets
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        num_history_runs=3,
        enable_agentic_memory=True,  # Let the Agent manage its memories
        markdown=True,
    )

# Main execution block to initialize the knowledge base
if __name__ == "__main__":
    print("Initializing financial advisor agent and loading knowledge base...")
    # This might take a moment on the first run.
    financial_agent = get_agent()
    
    # Load the knowledge base. Set recreate=True to force a rebuild.
    print("Loading knowledge from local directory. This may take a while...")
    financial_agent.knowledge.load(recreate=True) # Recreate to ingest new files
    print("Knowledge base loaded successfully.")
        
    print("\nInitialization complete.")
    print("You can now run the main server application.")
