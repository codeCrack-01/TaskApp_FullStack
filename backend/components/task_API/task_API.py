import enum
from flask import Blueprint, flash, jsonify, render_template, redirect, url_for, request
from sqlalchemy import Column, Integer, String, Enum, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from flask_sqlalchemy import SQLAlchemy

# Create a Blueprint instance
Task_API = Blueprint('task_API', __name__, template_folder='templates')

# Access the SQLAlchemy instance from the main app
db = SQLAlchemy()

# Define the base for the ORM
Base = declarative_base()

# Define the Status enumeration
class Status(enum.Enum):
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETED = 'Completed'

# Define the Task model
class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(Status), default=Status.NOT_STARTED, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status.value
        }

# Create the engine and session
engine = create_engine('sqlite:///backend/taskManager.db')  # Use the same database as app.py
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Define the main route
@Task_API.route('/')
def main_task():
    return render_template('task_api.html')

# Dynamically sending Enum values:
@Task_API.route('/statusOptions', methods=["GET"])
def get_options():
    status_options = [
        {"value":"NOT_STARTED", "label":"Not Started"},
        {"value":"IN_PROGRESS", "label":"In Progress"},
        {"value":"COMPLETED", "label":"Completed"}
    ]
    return jsonify(status_options)

def validateTask(new_task): # Check if the task already exists in the project (by title)
    allTasks = session.query(Task).all()

    for task in allTasks:
        if (task.title == new_task.title):
            return False
        
    return True

############################################################################################
# Define the route to add a task
@Task_API.route('/add', methods=['POST'])
def addTask():
    data = request.json

    # Check if all required fields are present
    if not data or 'title' not in data or 'description' not in data or 'status' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    title = data['title']
    description = data['description']
    status = data['status']

    try:
        new_task = Task(title=title, description=description, status=status)

        # Validate if task exists or not 
        if (validateTask(new_task)):
            # Add the new task to the database

            session.add(new_task)
            session.commit()

            print ("Task Added to Database (py)!")
            return("Task Added to Database (js)!")
        else:
            return('Task already exists !')

    except Exception as e:
        # Handle any database or other exceptions
        session.rollback()  # Rollback transaction on error
        return(jsonify({"error": str(e)}), 500)

@Task_API.route('/delete', methods=['POST'])
def deleteTask():
    data = request.json

    # Check if all required fields are present
    if not data or ('title' not in data and 'id' not in data):
        return jsonify({"error": "Missing required fields"}), 400

    if data['title']:
        title = data['title']
    else:
        title = None
    if data['id']:
        id = data['id']
    else:
        id = None

    # Query the database to delete the task
    global target
    target = None

    if id is not None:
        target = session.query(Task).filter_by(id=id).first()
    else:
        target = session.query(Task).filter_by(title=title).first()

    # Delete the specified task
    session.delete(target)
    session.commit()

    print (f"Task {id} is deleted (py)!")

    return(f"Task {id} is deleted (js)!")

@Task_API.route('/deleteAll', methods=['POST'])
def deleteAll():
    session.query(Task).delete()
    session.commit()

    print("Deleted all tasks (py)!")
    return ('Deleted all tasks (js)!')

@Task_API.route('/getTasks', methods=['GET'])
def showAll():
    tasks = session.query(Task).all()
    task_dict = [task.to_dict() for task in tasks]
    return jsonify(task_dict)

@Task_API.route('/updateTask', methods=['POST'])
def updateTask():
    data = request.json;

    if not data or ('task_id' not in data and 'task_title' not in data) or 'status' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    if data['task_title']:
        title = data['task_title']
    else:
        title = None
    if data['task_id']:
        id = data['task_id']
    else:
        id = None

    new_status = data['status']

    # Query the database to delete the task
    global target
    target = None

    if id is not None:
        target = session.query(Task).filter_by(id=id).first()
    else:
        target = session.query(Task).filter_by(title=title).first()

    target.status = new_status # type: ignore
    session.commit()

    return f'Successfully updated task: {id}'
    
    