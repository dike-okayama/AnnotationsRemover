# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify

from AnnotationRemover.src.typehint_remover import remove_typehint

app = Flask(__name__)


@app.route("/")
def root():
    return render_template("index.html")


@app.route("/remove/", methods=["POST"])
def remove():
    source = request.form.get("source")

    try:
        return jsonify(dict(source=remove_typehint(source)))
    except:
        return jsonify(dict(source="..."))


if __name__ == "__main__":
    app.run(debug=True)
