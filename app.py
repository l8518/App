import os
from werkzeug.middleware.proxy_fix import ProxyFix
from app import create_app, socketio

config_name = os.getenv('FLASK_ENV')
app = create_app(config_name)
