from fastapi import APIRouter, HTTPException
from pymongo import errors

from app.models.common import CommonRequest

from app.core.databases.mongodb import mongo_db as mdb

router = APIRouter(prefix="/common", tags=["common"])

@router.get("/{key}")
def get_key_value(key: str):
    common_collection = mdb.get_collection("common")
    return common_collection.find_one({"key": key}, {"_id": 0, "value": 1})

@router.post("")
def add_key_value(body: CommonRequest):
    try:
        common_collection = mdb.get_collection("common")
        common_collection.create_index("key", unique=True)
        common_collection.insert_one(dict(body))
        return body
    except errors.DuplicateKeyError:
        raise HTTPException(status_code=500, detail=f"Key {body.key} already exists")
    

@router.put("")
def update_key_value(body: CommonRequest):
    try:
        common_collection = mdb.get_collection("common")
        common_collection.update_one(
            {"key": body.key},
            {"$set": {"value": body.value}}
        )
        return body
    except Exception as e:
            raise HTTPException(status_code=500, detail=f"Fail to update {body.key} to new value {e}.")