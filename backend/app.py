from flask import Flask, render_template, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from components.task_API.task_API import Task_API  # Assuming correct path to blueprint

app = Flask(__name__, template_folder='Templates', static_folder='Static')

# Cross-Origin Sharing with restricted client calls
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # Only "this" url can connect to the 'backend'.
app.secret_key = 'hello'  # Ensure this is kept secret in production.

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///backend/taskManager.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Register the blueprint
app.register_blueprint(Task_API, url_prefix="/api")

@app.route('/')
def main():
    return redirect(url_for('home'))

@app.route('/home')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
