import flask
from models import *
from flask import Flask, request, jsonify, session, redirect, url_for
from sqlalchemy import select
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import ValidationError
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import joinedload 

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = 'christoaj466' 
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:christo466@localhost:5432/flaskdb"
# engine = create_engine('postgresql://postgres:christo466@localhost:5432/flaskdb', echo=True) 
# Session = sessionmaker(bind=engine)

CORS(app)
db.init_app(app)
@app.route("/")
def home():
    return "Hello, world"

#to login
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

   
    credential = db.session.query(Credential).filter_by(username=username).first()

    if not credential or not credential._password == password:
        return jsonify({'message': 'Invalid username or password'}), 401

  
    session['user_id'] = credential.id
    session['username'] = credential.username
    
    user_id = session.get('user_id')
    username = session.get('username')
    email = credential.email
    phone = credential.phone
    image_url = credential.image_url
    designation = credential.designation

    return jsonify({'message': 'Login successful', 'username': credential.username, 'user_id': user_id, 'username': username, 'image_url':image_url, 'email':email,'phone':phone,'designation':designation  }), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200

#to create designation
# @app.route('/designation', methods=['POST'])
# def designation():
#     data = request.json
#     console.log(data)
#     new_designation = Designation(
#         name=data['name'],
#         leaves=data.get('leaves', None) 
#     )
#     db.session.add(new_designation)
#     db.session.commit()
#     return jsonify({'message': 'Designation created successfully', 'id': new_designation.id}), 201

@app.route('/designation', methods=['POST'])
def add_designation():
    data = request.get_json()
    name = data['name']
    leaves = data['leaves']
    
    if not name or not leaves:
        return jsonify({"message": "name and leaves are required"}), 400

    new_designation = Designation(name=name, leaves=leaves)

    db.session.add(new_designation)
    db.session.commit()
    return jsonify({'message': 'Designation added successfully'}), 201
    
#to delete designation
@app.route('/designation/delete/<int:id>', methods=['DELETE'])
def delete_designation(id):  
        designation = db.session.query(Designation).filter_by(id=id).first()
        if not designation:
            return jsonify({'error': 'Designation not found'}), 404
        
        db.session.delete(designation)
        db.session.commit()
        
        return jsonify({'message': 'Designation deleted successfully'}), 200
  
#to delete employee
@app.route('/employee/delete/<int:id>', methods=['DELETE'])
def delete_employee(id):  
        employee = db.session.query(Employee).filter_by(id=id).first()
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        db.session.delete(employee)
        db.session.commit()
        
        return jsonify({'message': 'Employee deleted successfully'}), 200
    


@app.route("/designations")
def designations():
    select_query = db.select(Designation).order_by(Designation.id)
    designations = db.session.execute(select_query).scalars()
    detail = []
    for designation in designations:
      details = {"id" : designation.id,
         "designation" : designation.name,
         "leaves": designation.leaves,
        
         }
      detail.append(details)
    return flask.jsonify(detail)






# #to get designation
# @app.route('/designations/<int:id>', methods=['GET'])
# def get_designation(id):
#     designation = db.session.query(Designation).filter_by(id=id).first()
#     return jsonify({
#         'id': designation.id,
#         'name': designation.name,
#         'leaves': designation.leaves,
#         # 'employees': [emp.name for emp in designation.employees] if designation.employees else []
#     })
 #to update designation
@app.route('/designation/<int:id>', methods=['PUT'])
def update_designation(id):
    designation = db.session.query(Designation).filter_by(id=id).first()
    data = request.json
    designation.name = data.get('name', designation.name)
    designation.leaves = data.get('leaves', designation.leaves)  # Adjust as per your model definition
    db.session.commit()
    return jsonify({'message': 'Designation updated successfully'}), 200



#to create credential
@app.route('/credential', methods=['POST'])
def credentials():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    designation= data.get('designation')
    phone = data.get("phone")
    email = data.get("email")
    image_url = data.get("image_url")
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    credential = Credential(username=username,_password=password, designation=designation, phone=phone, email=email, image_url=image_url)
     
    try:
        db.session.add(credential)
        db.session.commit()
        return jsonify({"message": "Credential added successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username already exists"}), 409
    
    
#to get credential
@app.route('/credential/<int:id>', methods=['GET'])
def credential(id):
    credential = db.session.query(Credential).filter_by(id=id).first()
    return jsonify({
        'id': credential.id,
        'username': credential.username,
        'password': credential._password,
        
    })


#to create employees
@app.route('/employee', methods=['POST'])
def employee():
    data = request.json
    print(data)
    new_employee = Employee(
        first_name=data['first_name'],
        last_name=data['last_name'],
        Address=data['Address'],
        phone=data['phone'],
        email=data['email'],
        designation_id=data['designation_id'],
    )
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({'message': 'Employee created successfully', 'id': new_employee.id}), 201

#to get employee
# @app.route('/employees/<int:id>', methods=['GET'])
# def get_employee(id):
#     employee = db.session.query(Employee).filter_by(id=id).first()
#     return jsonify({
#         'id': employee.id,
#         'firstname': employee.first_name,
#         "lastname":employee.last_name,
#         'Address': employee.Address,
#         'phone': employee.phone,
#         'email': employee.email,
#         'designation_id': employee.designation_id,
#         'created_at': employee.created_at,
#         'updated_at': employee.updated_at,
#         'deleted_at': employee.deleted_at
#     })

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
            Designation.name.label('designation_name'),
            Designation.leaves.label('total_leaves'),
            Leave.leave_taken.label('leaves_taken')
        )
        .outerjoin(Designation, Employee.designation_id == Designation.id)
        .outerjoin(Leave, Leave.employee_id == Employee.id)
    )
    
    employees = db.session.execute(select_query).fetchall()
    print(employees)
    employees_data = []
    for employee in employees:
        employee_data = {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "address": employee.Address,
            "phone": employee.phone,
            "email": employee.email,
            "designation_name": employee.designation_name,
            "total_leaves": employee.total_leaves,
            "leaves_taken": employee.leaves_taken,
        }
        employees_data.append(employee_data)
    
    return jsonify(employees_data)

@app.route("/employee/<int:id>", methods=['GET'])
def getemployee(id):
    select_query = (
        db.session.query(
            Employee.id,
            Employee.first_name,
            Employee.last_name,
            Employee.Address,
            Employee.phone,
            Employee.email,
            Designation.name.label('designation_name'),
            Designation.leaves.label('total_leaves'),
            Leave.leave_taken.label('leaves_taken')
        )
        .outerjoin(Designation, Employee.designation_id == Designation.id)
        .outerjoin(Leave, Leave.employee_id == Employee.id)
        .filter(Employee.id == id)
    )
    
    employee = db.session.execute(select_query).fetchone()
    
    if employee is None:
        return jsonify({"error": "Employee not found"}), 404
    
    employee_data = {
        "id": employee.id,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "address": employee.Address,
        "phone": employee.phone,
        "email": employee.email,
        "designation_name": employee.designation_name,
        "total_leaves": employee.total_leaves,
        "leaves_taken": employee.leaves_taken,
    }
    
    return jsonify(employee_data)


#to update employee
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = db.session.query(Employee).filter_by(id=id).first()
    data = request.json
    employee.first_name = data.get('first_name', employee.first_name)
    employee.last_name = data.get('last_name',employee.last_name)
    employee.Address = data.get('address', employee.Address)
    employee.phone = data.get('phone', employee.phone)
    employee.email = data.get('email', employee.email)
    employee.designation_id = data.get('designation_id', employee.designation_id)
    
    db.session.commit()
    return jsonify({'message': 'Employee updated successfully'}), 200


# @app.route('/employees/<int:id>/leaves', methods=['PUT'])
# def update_employee_leaves(id):
#     employee = db.session.query(Leave).filter_by(employee_id=id).first()
#     print(employee,"employee")
#     if not employee:
#         return jsonify({'message': 'Employee not found'}), 404
    
#     data = request.json
#     print(data.get('leave_taken'))
#     employee.leave_taken = data.get('leave_taken', employee.leave_taken)
#     print("leaves",employee.leave_taken)
#     db.session.commit()
#     return jsonify({'message': 'Leaves taken updated successfully'}), 200

@app.route('/employees/<int:id>/leaves', methods=['PUT'])
def update_employee_leaves(id):
    leaves = db.session.query(Leave).filter_by(employee_id=id).first()
    employee = db.session.query(Employee).options(joinedload(Employee.designation)).filter_by(id=id).first()

    print(leaves,"leaves")
    print(employee,"employees")
    if not leaves:
        return jsonify({'message': 'Employee not found'}), 404
    
    data = request.json
    new_leaves_taken = int(data.get('leave_taken', leaves.leave_taken))
    print(new_leaves_taken,"new_leaves")

    # Fetch the designation to get the maximum allowed leaves
  
    designation = employee.designation
    max_allowed_leaves = designation.leaves
    print(max_allowed_leaves,"max_leaves")

    if new_leaves_taken > max_allowed_leaves:
        return jsonify({'error': 'Leaves taken exceed allowed leaves for the designation'}), 400

    leaves.leave_taken = new_leaves_taken
    db.session.commit()

    return jsonify({'message': 'Leaves taken updated successfully'}), 200









# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     if not data or not data.get('username') or not data.get('password'):
#         return jsonify({'message': 'Missing username or password'}), 400

#     username = data['username']
#     password = data['password']

#     # Create a session
#     session = Session()

#     try:
#         credential = session.query(Credential).filter_by(username=username).first()
#         if not credential or not credential.verify_password(password):
#             return jsonify({'message': 'Invalid username or password'}), 401

#         # Generate JWT token
#         token = jwt.encode({'username': username, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')

#         return jsonify({'token': token.decode('UTF-8')}), 200

#     except Exception as e:
#         return jsonify({'message': 'Internal server error'}), 500

#     finally:
#         session.close()


#to get employees
# @app.route("/employees")
# def employees():
#     select_query = db.select(Employee).order_by(Employee.id.desc())
#     employees = db.session.execute(select_query).scalars()
#     detail = []
#     for employee in employees:
#       details = {"id" : employee.id,
#          "firstname" : employee.first_name,
#          "last_name": employee.last_name,
#          "Address":employee.Address ,
#          "phone":employee.phone,
#          "email":employee.email,
#          "designation_id":employee.designation_id
#          }
#       detail.append(details)
#     return flask.jsonify(detail)



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
    select_query = db.select(Leave).order_by(Leave.id.desc())
    leaves = db.session.execute(select_query).scalars()
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