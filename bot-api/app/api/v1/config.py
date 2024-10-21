import datetime
from fastapi import APIRouter, HTTPException

from app.models.config import ReportConfigRequest
from app.core.databases.mongodb import mongo_db as mdb

router = APIRouter(prefix="/config", tags=["config"])

def get_report_config(guild:str):
    query = {"guild": guild}
    config_collection = mdb.get_collection("config")
    guild_config = config_collection.find_one(query)

    if guild_config is not None:
        return guild_config["report"] or {}

    return {}

def update_report_config(guild:str, report:ReportConfigRequest):
    query = {"guild": guild}
    config_collection = mdb.get_collection("config")
    update = {
        "$set": {
            "guild": guild,
            "report": report,
            "updatedAt": datetime.datetime.now(datetime.UTC)
        },
        "$setOnInsert": {
            "createdAt": datetime.datetime.now(datetime.UTC)
        }
    }
    config_collection.update_one(query, update, upsert=True)


@router.get("/report/{guild}")
def get_guild_report_config(guild:str):
    try:
        return get_report_config(guild)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get report configuration {e}.")


@router.post("/report/{guild}")
def update_guild_report_config(guild:str, body:ReportConfigRequest):
    try:
        report_config = {
            "channelID": body.channelID,
            "interval": body.interval
        }
        update_report_config(guild, report_config)
        return "Successfully updated guild report configuration."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update report configuration {e}.")
