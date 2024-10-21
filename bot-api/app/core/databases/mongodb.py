from pymongo import MongoClient, errors
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self, uri: str, db_name: str):
        self.uri = uri
        self.db_name = db_name
        self.client = None
        self.database = None
        self.connect()

    def connect(self):
        try:
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=5000)
            self.database = self.client[self.db_name]
            self.client.admin.command("ping")
            logger.info(f"Successfully connected to MongoDB at {self.uri}")
        except errors.ServerSelectionTimeoutError as err:
            logger.error(f"Failed to connect to MongoDB: {err}")
        except Exception as e:
            logger.error(f"An error occured: {e}")

    def get_collection(self, collection_name: str):
        return self.database[collection_name]
    
    def get_collections(self):
        return self.database.list_collection_names()
    
MONGO_URI = f"mongodb://admin:root@mongodb:27017"
DB_NAME = "endor"

mongo_db = MongoDB(MONGO_URI, DB_NAME)