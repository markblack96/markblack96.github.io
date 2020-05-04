# test server bcuz too lazy to use static files + a localhost web server

from flask import Flask, render_template 
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('jumpscares.html')
