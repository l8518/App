from flask_socketio import emit, send
from .. import socketio


@socketio.on('plot_update')
def on_plot_update(info):
    """Updating plot due to change in data"""
    emit('plot_update', {'variable': "var", 'new_value': 0, 'index': 0})

@socketio.on("model_update")
def on_model_update(info):
    """Updating model due to change in data"""
    
    emit("model_update", {})

@socketio.on('connect')
def test_connect():
    print("Connection succesful")