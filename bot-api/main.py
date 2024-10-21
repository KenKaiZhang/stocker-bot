import os
import importlib
import logging
from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)

app = FastAPI()

route_dir = os.path.dirname(__file__) + "/app/api/v1"
for filename in os.listdir(route_dir):
    if filename.endswith('.py') and filename != '__init__.py':
        module_name = f'app.api.v1.{filename[:-3]}'
        module = importlib.import_module(module_name)
        if hasattr(module, 'router'):
            app.include_router(module.router, prefix="/api/v1")
            logging.info(f"Router from {module_name} included.")
        else:
            logging.warning(f"Router from {module_name} not found.")

@app.get("/")
def ping_server():
    return "Ping from server..."