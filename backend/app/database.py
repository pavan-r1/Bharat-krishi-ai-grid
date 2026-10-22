
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConfigurationError

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB_NAME", "bkig")

initialization_error = None
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000) if uri else None
except ConfigurationError as exc:
    # Malformed/unresolvable SRV configuration should not crash module import.
    # DB-backed endpoints still fail closed and health reports unavailable.
    client = None
    initialization_error = "MongoDB URI could not be resolved or parsed"
    message = str(exc).casefold()
    if "_mongodb._tcp" in message or "srv" in message or "nameservers failed" in message:
        initialization_error = "MongoDB Atlas SRV DNS lookup failed. Check the cluster hostname and DNS/network access."
    elif "dnspython" in message:
        initialization_error = "MongoDB Atlas SRV support requires the dnspython dependency."
db = client[db_name] if client is not None else None


def check_database():
    if client is None:
        return {
            "connected": False,
            "message": initialization_error or "MONGODB_URI is not configured",
        }

    try:
        client.admin.command("ping")
        return {"connected": True, "database": db_name}
    except Exception:
        return {
            "connected": False,
            "message": "Database connection failed",
        }
