import os
import logging
from app import create_app
from app.config import config

env = os.environ.get("FLASK_ENV", "development").lower()
config_class = config.get(env, config["development"])

app = create_app(config_class)

if __name__ == "__main__":
    app.run(
        host=app.config["HOST"],
        port=app.config["PORT"],
        debug=app.config["DEBUG"]
    )
