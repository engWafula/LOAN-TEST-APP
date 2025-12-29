import os


class Config:
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    GRAPHIQL_ENABLED = os.environ.get("GRAPHIQL_ENABLED", "True").lower() == "true"
    HOST = os.environ.get("HOST", "0.0.0.0")
    PORT = int(os.environ.get("PORT", 5000))
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")


class DevelopmentConfig(Config):
    DEBUG = True
    GRAPHIQL_ENABLED = True


class ProductionConfig(Config):
    DEBUG = False
    GRAPHIQL_ENABLED = False


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    GRAPHIQL_ENABLED = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}

