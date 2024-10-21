import datetime
from fastapi import APIRouter, HTTPException, status

from app.core.databases.mongodb import mongo_db as mdb

router = APIRouter(prefix="/guilds", tags=["guilds"])

@router.get("")
def get_guilds():
    try:
        guild_collection = mdb.get_collection("guilds")
        guilds = guild_collection.find({}, {"_id": 0})

        return list(guilds)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retreive guilds: {e}.")


@router.post("/{guild}")
def add_new_guild(guild:str):
    try:
        query = {"guild": guild}
        guild_collection = mdb.get_collection("guilds")

        target_guild = guild_collection.find_one(query)
        if target_guild is not None:
            raise HTTPException(status_code=403, detail=f"Guild {guild} already exists.")

        guild_collection.insert_one({
            "guild": guild,
            "createdAt": datetime.datetime.now(datetime.UTC)
        })
        return "Sccessfully added new guild."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add new guild: {e}.")

@router.delete("/{guild}")
def delete_guild(guild:str):
    try:
        query = {"guild": guild}

        guild_collection = mdb.get_collection("guilds")
        target_guild = guild_collection.find_one(query)

        if target_guild is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Guild {guild} not found")

        collections = mdb.get_collections()
        for collection_name in collections:
            collection = mdb.get_collection(collection_name)
            collection.delete_many(query)

        return "Successfully remove guild."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove guild: {e}.")