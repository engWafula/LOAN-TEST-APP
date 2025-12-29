from flask_graphql import GraphQLView
from app.schemas.schema import schema



def register_graphql(app):
    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view(
            "graphql",
            schema=schema,
            graphiql=app.config.get("GRAPHIQL_ENABLED", True)
        )
    )

