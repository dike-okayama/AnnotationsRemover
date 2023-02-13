# -*- coding: utf-8 -*-

from typing import Any

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from AnnotationsRemover.src.remove_annotations import remove_annotations

app: Flask = Flask(__name__)
app.config["SECRET_KEY"] = "secret!!"

sio: SocketIO = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index() -> str:
    return render_template("index.html")


@sio.on("remove")
def remove(json) -> None:
    source: dict[str:Any] = json.get("source")
    emit("text_update", {"source": remove_annotations(source)}, broadcast=False)


if __name__ == "__main__":
    sio.run(app)
