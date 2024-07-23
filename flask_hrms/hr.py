import flask
from models import *
from flask import Flask, request, jsonify, session, redirect, url_for
from sqlalchemy import select
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import ValidationError
from flask_cors import CORS,cross_origin
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import joinedload 
from datetime import datetime, timezone
from sqlalchemy.orm import joinedload

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = 'christoaj466' 
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:christo466@localhost:5432/flaskunit"

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
@app.route("/")
def home():
    return "Hello, world"


#to login
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username:
        return jsonify({'message': 'Username is required'}), 400
    if not password:
        return jsonify({'message': 'Password is required'}), 400
    credential = db.session.query(Credential).filter_by(username=username).first()

    if not credential :
        return jsonify({'message': 'Invalid username'}), 401
    if not credential.check_password(password):
        return jsonify({'message': 'Invalid Password'}), 401
    session['user_id'] = credential.id
    session['username'] = credential.username
    
    user_id = session.get('user_id')
    username = session.get('username')
    email = credential.email
    phone = credential.phone
    image_url = credential.image_url
    designation = credential.designation

    response = {
        "data": {
            "user_id": user_id,
            "username": username,
            "image_url": image_url,
            "email": email,
            "phone": phone,
            "designation": designation
        },
        "status": True,
        "status_message": "Logged in successfully",
        "timestamp": datetime.utcnow().isoformat()
    }

    return jsonify(response), 200

#to logout
@app.route('/logout', methods=['POST'])
@cross_origin()
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    response = {
        "data": {},
        "status": True,
        "status_message": "Logged out successfully",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    return jsonify(response), 200

#to create designation
@app.route('/designation', methods=['POST'])
def add_designation():
    data = request.get_json()
    name = data.get('name')
    leaves = data.get('leaves')
    
    if not name or not leaves:
        return jsonify({
            "status": False,
            "status_message": "Designation and leaves are required",
            "timestamp": datetime.utcnow().isoformat()
        }), 400
    existing_designation = db.session.query(Designation).filter_by(name=name).first()
    if existing_designation:
        return jsonify({
            "status": False,
            "status_message": "Designation with this name already exists",
            "timestamp": datetime.utcnow().isoformat()
        }), 409
    new_designation = Designation(name=name, leaves=leaves)

    db.session.add(new_designation)
    db.session.commit()

    response = {
        "data": {
            "name": name,
            "leaves": leaves,
        },
        "status": True,
        "status_message": "Designation added successfully",
        "timestamp": datetime.utcnow().isoformat()
    }

    return jsonify(response), 201
  

#to delete designation
@app.route('/designation/delete/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_designation(id):  
    designation = db.session.query(Designation).filter_by(id=id).first()
    if not designation:
        return jsonify({
            'data': {},
            'status': False,
            'status_message': 'Designation not found',
            'timestamp': datetime.utcnow().isoformat()
        }), 404

  
    employees = db.session.query(Employee).filter_by(designation_id=id).all()

   
    for employee in employees:
        leaves = db.session.query(Leave).filter_by(employee_id=employee.id).all()
        for leave in leaves:
            db.session.delete(leave)
        db.session.delete(employee)

   
    db.session.delete(designation)
    db.session.commit()

    return jsonify({
        'data': {},
        'status': True,
        'status_message': 'Designation and associated data deleted successfully',
        'timestamp': datetime.utcnow().isoformat()
    }), 200



#to delete employee
@app.route('/employee/delete/<int:id>', methods=['DELETE'])
def delete_employee(id):  
    employee = db.session.query(Employee).filter_by(id=id).first()
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    
    employee.deleted_at = datetime.now(timezone.utc)
    db.session.commit()
    
    return jsonify({'message': 'Employee deleted successfully'}), 200

    

#to get designations
@app.route("/designations")
def designations():
    select_query = db.select(Designation).order_by(Designation.id)
    designations = db.session.execute(select_query).scalars()
    
    detail = []
    for designation in designations:
        details = {
            "id": designation.id,
            "designation": designation.name,
            "leaves": designation.leaves,
        }
        detail.append(details)

    response = {
        "data": detail,
        "status": True,
        "status_message": "designation details",
        "timestamp": datetime.utcnow().isoformat()
    }

    return jsonify(response)

#to update designation
@app.route('/designation/<int:id>', methods=['PUT'])
def update_designation(id):
    designation = db.session.query(Designation).filter_by(id=id).first()
    data = request.json
    name = data.get('name')
    leaves = data.get('leaves')
    designation.name = data.get('name', designation.name)
    designation.leaves = data.get('leaves', designation.leaves) 
    if not data or not name or not leaves:
        return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Designation name and leaves are required",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 400
    db.session.commit()
    response_data = {
        "data": {
            "id": designation.id,
            "name": designation.name,
            "leaves": designation.leaves,
        },
        "status": True,
        "status_message": "Designation updated successfully",
        "timestamp": datetime.utcnow().isoformat()
    }

    return jsonify(response_data), 200

#to create credential    
@app.route('/credential', methods=['POST'])
def credentials():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    designation = data.get('designation')
    phone = data.get('phone')
    email = data.get('email')
    image_url = data.get('image_url')

    if not username or not password:
        return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Username and password are required",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 400

    existing_user = db.session.query(Credential).filter_by(username=username).first()
    if existing_user:
        return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Username already exists",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 409

    credential = Credential(
        username=username,
        designation=designation,
        phone=phone,
        email=email,
        image_url=image_url
    )
    credential.set_password(password)

    db.session.add(credential)
    db.session.commit()
    
    response_data = {
        "data": {
            "id": credential.id,
            "username": credential.username,
            "designation": credential.designation,
            "phone": credential.phone,
            "email": credential.email,
            "image_url": credential.image_url
        },
        "status": True,
        "status_message": "Credential added successfully",
        "timestamp": datetime.utcnow().isoformat()
    }
    return jsonify(response_data), 201

    
    

#to create employee
@app.route('/employee', methods=['POST'])
def employee():
   
        data = request.json
        print(data)

        required_fields = ["first_name", "last_name", "Address", "phone", "email", "designation_id","salary"]
    
    
        if not all(field in data and data[field] for field in required_fields):
           return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Missing required employee data",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 400
        existing_employee = db.session.query(Employee).filter_by(first_name=data['first_name']).first()
        if existing_employee:
         return jsonify({
            "status": False,
            "status_message": "Employee with this name already exists",
            "timestamp": datetime.utcnow().isoformat()
        }), 409

        new_employee = Employee(
            first_name = data['first_name'],
            last_name = data['last_name'],
            Address = data['Address'],
            phone = data['phone'],
            email = data['email'],
            salary = data['salary'],
            designation_id=data['designation_id'],
        )
       
        db.session.add(new_employee)
        db.session.commit()

        response_data = {
            "data": {
                "id": new_employee.id,
                "first_name": new_employee.first_name,
                "last_name": new_employee.last_name,
                "address": new_employee.Address,
                "phone": new_employee.phone,
                "email": new_employee.email,
                "salary": new_employee.salary,
                "designation_id": new_employee.designation_id,
            },
            "status": True,
            "status_message": "Employee created successfully",
            "timestamp": datetime.utcnow().isoformat()
        }

        return jsonify(response_data), 201


#to get employee
@app.route("/employees", methods=['GET'])
def employees():
    select_query = (
        db.session.query(
            Employee.id,
            Employee.first_name,
            Employee.last_name,
            Employee.Address,
            Employee.phone,
            Employee.email,
            Employee.salary,
            Employee.designation_id,
            Designation.name.label('designation_name'),
            Designation.leaves.label('total_leaves'),
            Leave.leave_taken.label('leaves_taken')
        )
        .outerjoin(Designation, Employee.designation_id == Designation.id)
        .outerjoin(Leave, Leave.employee_id == Employee.id)
        .filter(Employee.deleted_at.is_(None))
    )
    
    employees = db.session.execute(select_query).fetchall()
    employees_data = []
    for employee in employees:
        employee_data = {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "address": employee.Address,
            "phone": employee.phone,
            "email": employee.email,
            "salary": employee.salary,
            "designation_id": employee.designation_id,
            "designation_name": employee.designation_name,
            "total_leaves": employee.total_leaves,
            "leaves_taken": employee.leaves_taken,
        }
        employees_data.append(employee_data)
    
    response = {
        "data": employees_data,
        "status": True,
        "status_message": "Employees fetched successfully",
        "timestamp": datetime.utcnow().isoformat()
    }
    return jsonify(response)

#to update employee
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = db.session.query(Employee).filter_by(id=id).first()
    
    if not employee:
        return jsonify({"status": False, "status_message": "Employee not found"}), 404
    
    data = request.json
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address = data.get('address')
    phone = data.get('phone')
    email = data.get('email')
    designation_id = data.get('designation_id')
    salary = data.get('salary')
    
    # Check for required fields
    if not first_name or not last_name or not address or not phone or not email or not salary or not designation_id:
        return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Required fields are missing",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 400
    
    # Update employee details
    employee.first_name = first_name
    employee.last_name = last_name
    employee.Address = address
    employee.phone = phone
    employee.email = email
    employee.designation_id = designation_id
    
    try:
        new_salary = float(salary)
        employee.salary = new_salary
    except ValueError:
        return jsonify(
            {
                "data": {},
                "status": False,
                "status_message": "Invalid salary value",
                "timestamp": datetime.utcnow().isoformat()
            }
        ), 400
    
    db.session.commit()
    
    response_data = {
        "data": {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "address": employee.Address,
            "phone": employee.phone,
            "email": employee.email,
            "salary": employee.salary,
            "designation_id": employee.designation_id,
        },
        "status": True,
        "status_message": "Employee updated successfully",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    return jsonify(response_data), 200





#to update leaves
@app.route('/employees/<int:id>/leaves', methods=['PUT'])
def update_employee_leaves(id):
    leaves = db.session.query(Leave).filter_by(employee_id=id).first()
    employee = db.session.query(Employee).options(joinedload(Employee.designation)).filter_by(id=id).first()
    if not employee:
        return jsonify({'message': 'Employee not found'}), 404
    data = request.json
    new_leaves_taken = int(data.get('leave_taken', 0))
    designation = employee.designation
    max_allowed_leaves = designation.leaves
    if new_leaves_taken > max_allowed_leaves:
        return jsonify({'error': 'Leaves taken exceed allowed leaves for the designation'}), 400
    if not leaves:   
        leaves = Leave(employee_id=id, leave_taken=new_leaves_taken)
        db.session.add(leaves)
    else:      
        leaves.leave_taken = new_leaves_taken
    db.session.commit()
    return jsonify({'message': 'Leaves taken updated successfully'}), 200

#to create leave
@app.route('/leave', methods=['POST'])
def leave():
    data = request.json
    new_leaves = Leave(
        leave_taken=data['leave_taken'],
        employee_id=data['employee_id'],
        
    )
    db.session.add(new_leaves)
    db.session.commit()
    return jsonify({'message': 'leaves created successfully', 'id': new_leaves.id}), 201

#to get leaves
@app.route("/leaves")
def leaves():
    select_query = db.select(Leave).where(Leave.employee_id != None).order_by(Leave.id.desc())
    leaves = db.session.execute(select_query).scalars()
    print("leaves called")
    detail = []
    for leave in leaves:
      details = {"id" : leave.id,
         "firstname" : leave.employees.first_name,
         "last_name": leave.employees.last_name,
        "leave_taken":leave.leave_taken
         }
      detail.append(details)
    return flask.jsonify(detail)


with app.app_context():
  db.create_all()
  
 
  
if __name__ == "__main__":
  init_db()
  app.run(port=5000)