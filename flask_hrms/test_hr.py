import unittest
from flask import Flask, json, session
from hr import app, db, Credential, Designation, Employee, Leave , logout
from werkzeug.security import generate_password_hash

class LoginTestCase(unittest.TestCase):
    def setUp(self):
        
        self.app = app
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.app.testing = True
        db.create_all()
      
        test_user = Credential(
            username='testuser',
            _password=generate_password_hash('password'), 
            email='testuser@example.com',
            phone='1234567890',
            image_url='http://example.com/image.png',
            designation='Developer'
        )
        db.session.add(test_user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login_missing_username(self):
        response = self.app.post('/login', json={'password': 'password'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Username is required')

    def test_login_missing_password(self):
        response = self.app.post('/login', json={'username': 'testuser'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Password is required')

    def test_login_invalid_username(self):
        response = self.app.post('/login', json={'username': 'wronguser', 'password': 'password'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Invalid username')

    def test_login_invalid_password(self):
        response = self.app.post('/login', json={'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Invalid Password')

    def test_login_success(self):
        response = self.app.post('/login', json={'username': 'testuser', 'password': 'password'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['status'])
        self.assertEqual(response.json['status_message'], 'Logged in successfully')
        self.assertIn('data', response.json)
        self.assertEqual(response.json['data']['username'], 'testuser')


class AddDesignationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_add_designation_success(self):
        response = self.client.post('/designation', json={
            'name': 'Developer',
            'leaves': 20
        })
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['data']['name'], 'Developer')
        self.assertEqual(data['data']['leaves'], 20)
        self.assertEqual(data['status_message'], 'Designation added successfully')

    def test_add_designation_missing_fields(self):
        response = self.client.post('/designation', json={})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data['status'])
        self.assertEqual(data['status_message'], 'Designation and leaves are required')

    def test_add_designation_existing(self):
        with self.app.app_context():
            designation = Designation(name='Developer', leaves=20)
            db.session.add(designation)
            db.session.commit()

        response = self.client.post('/designation', json={
            'name': 'Developer',
            'leaves': 20
        })
        self.assertEqual(response.status_code, 409)
        data = response.get_json()
        self.assertFalse(data['status'])
        self.assertEqual(data['status_message'], 'Designation with this name already exists')

class DeleteDesignationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_delete_designation_success(self):
        with self.app.app_context():
            designation = Designation(name='Developer', leaves=20)
            db.session.add(designation)
            db.session.commit()
            designation_id = designation.id

        response = self.client.delete(f'/designation/delete/{designation_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['status_message'], 'Designation and associated data deleted successfully')

    def test_delete_designation_not_found(self):
        response = self.client.delete('/designation/delete/999')
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertFalse(data['status'])
        self.assertEqual(data['status_message'], 'Designation not found')

    def test_delete_designation_with_employees_and_leaves(self):
        with self.app.app_context():
            designation = Designation(name='Developer', leaves=20)
            db.session.add(designation)
            db.session.commit()
            designation_id = designation.id

            employee = Employee(first_name='John', last_name='Doe', Address='123 Main St',
                                phone='1234567890', email='john.doe@example.com',salary = 250000, designation_id=designation_id)
            employee_id = employee.id
            db.session.add(employee)
            db.session.commit()

            leave = Leave(leave_taken=5, employee_id=employee.id)
            leave_id = leave.id
            db.session.add(leave)
            db.session.commit()

        response = self.client.delete(f'/designation/delete/{designation_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['status_message'], 'Designation and associated data deleted successfully')

        with self.app.app_context():
            self.assertIsNone(db.session.query(Designation).filter_by(id=designation_id).first())
            self.assertIsNone(db.session.query(Employee).filter_by(id=employee_id).first())
            self.assertIsNone(db.session.query(Leave).filter_by(id=leave_id).first())



class GetDesignationsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_designations(self):
        with self.app.app_context():
            designation1 = Designation(id = 1, name='Developer', leaves=20)
            designation2 = Designation(id = 2, name='Manager', leaves=25)
            designation1_id = designation1.id
            designation2_id = designation2.id
            designation1_name = designation1.name
            designation2_name = designation2.name
            designation1_leaves = designation1.leaves
            designation2_leaves = designation2.leaves
            db.session.add(designation1)
            db.session.add(designation2)
            db.session.commit()

        response = self.client.get('/designations')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['status_message'], 'designation details')
        self.assertEqual(len(data['data']), 2)

        expected_data = [
            {"id": designation1_id, "designation": designation1_name, "leaves": designation1_leaves},
            {"id": designation2_id, "designation": designation2_name, "leaves": designation2_leaves},
        ]

        self.assertEqual(data['data'], expected_data)

class UpdateDesignationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()       
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()    
            
             
    def test_update_designation_success(self):
        with self.app.app_context():
            test_designation = Designation(id = 1,
                name='Developer',
                leaves=30
            )
            db.session.add(test_designation)
            db.session.commit() 
            test_designation_id = test_designation.id   
        response = self.client.put(
                f'/designation/{test_designation_id}',
                json={
                    'name': 'Tester',
                    'leaves': 20,
                   
                }
            )    
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.is_json)
        data = response.get_json()
        self.assertEqual(data['status'], True)
        self.assertEqual(data['status_message'], 'Designation updated successfully')
        self.assertEqual(data['data']['name'], 'Tester')
        self.assertEqual(data['data']['leaves'], 20)





class AddEmployeeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_add_employee_success(self):
      
        with self.app.app_context():
            designation = Designation(id = 1, name='Developer', leaves=20)
            designation_id = designation.id
            db.session.add(designation)
            db.session.commit()

     
        response = self.client.post('/employee', json={
            'first_name': 'christo',
            'last_name': 'johnson',
            'Address':'appadan house',
            'phone':'7356379662',
            'email':'christoaj466@gmail.com',
            'salary':250000,
            'designation_id': designation_id  
        })
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['data']['first_name'], 'christo')
        self.assertEqual(data['data']['last_name'], 'johnson')
        self.assertEqual(data['data']['address'], 'appadan house')
        self.assertEqual(data['data']['phone'], '7356379662')
        self.assertEqual(data['data']['email'], 'christoaj466@gmail.com')
        self.assertEqual(data['data']['salary'], 250000)
        self.assertEqual(data['data']['designation_id'], designation_id)  
        self.assertEqual(data['status_message'], 'Employee created successfully')
    def test_add_employee_missing_fields(self):
        response = self.client.post('/employee', json={})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data['status'])
        self.assertEqual(data['status_message'], 'Missing required employee data')
    def test_add_designation_existing(self):
        with self.app.app_context():
            designation = Designation(id = 1, name='Developer', leaves=20)
            designation_id = designation.id
            db.session.add(designation)
            db.session.commit()
            employee = Employee(first_name= 'christo',
            last_name= 'johnson',
            Address ='appadan house',
            phone = '7356379662',
            email = 'christoaj466@gmail.com',
            salary = 250000,
            designation_id = designation_id  )
            db.session.add(employee)
            db.session.commit()
            
        response = self.client.post('/employee', json={
            'first_name': 'christo',
            'last_name': 'johnson',
            'Address':'appadan house',
            'phone':'7356379662',
            'email':'christoaj466@gmail.com',
            'salary': 250000,
            'designation_id': designation_id  
        })
        self.assertEqual(response.status_code, 409)
        data = response.get_json()
        self.assertFalse(data['status'])
        self.assertEqual(data['status_message'], 'Employee with this name already exists')

class GetEnployeeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()   
            
    def test_get_employee(self):
        with self.app.app_context():
            designation = Designation(id = 1, name='Developer', leaves=20)
            designation_id = designation.id
            designation_name = designation.name
            db.session.add(designation)
            db.session.commit()
            employee = Employee(id = 1, first_name= 'christo',
            last_name= 'johnson',
            Address ='appadan house',
            phone = '7356379662',
            email = 'christoaj466@gmail.com',
            salary = 250000,
            designation_id = 1,
          
            )
            id = employee.id
            db.session.add(employee)
            db.session.commit()
        
        response = self.client.get('/employees')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['status'])
        self.assertEqual(data['status_message'], 'Employees fetched successfully')
        self.assertEqual(len(data['data']), 1)

        expected_data = [
            {'address':'appadan house',
             'designation_name' :designation_name ,
             'designation_id': 1,  
            'id':1,
            'first_name': 'christo',
            'last_name': 'johnson',
            
            'phone':'7356379662',
            'email':'christoaj466@gmail.com',
            'salary' : 250000,
            'total_leaves':20,
            'leaves_taken':None
            }
            
        ]

        self.assertEqual(data['data'], expected_data)   
   
        
class DeleteEmployeeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()       
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            
        
    def test_delete_employee_success(self):
     
        with self.app.app_context():
            self.test_designation = Designation(
                name='Developer',
                leaves=30
            )
            db.session.add(self.test_designation)
            db.session.commit()

         
            self.test_employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=self.test_designation.id,
                deleted_at=None
            )
            db.session.add(self.test_employee)
            db.session.commit()
            
            response = self.client.delete(f'/employee/delete/{self.test_employee.id}')
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['message'], 'Employee deleted successfully')

           
            deleted_employee = db.session.query(Employee).filter_by(id=self.test_employee.id).first()
            self.assertIsNotNone(deleted_employee.deleted_at)

    def test_delete_employee_not_found(self):
       
        with self.app.app_context():
            response = self.client.delete('/employee/delete/99999') 
            self.assertEqual(response.status_code, 404)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['error'], 'Employee not found')
     
            
class UpdateEmployeeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()       
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()    
            
             
    def test_update_employee_success(self):
       
       
        
        
        with self.app.app_context():
            test_designation = Designation(
                name='Developer',
                leaves=30
            )
            db.session.add(test_designation)
            db.session.commit()
            test_employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=test_designation.id,
                deleted_at=None
            )
            db.session.add(test_employee)
            db.session.commit()
            response = self.client.put(
                f'/employees/{test_employee.id}',
                json={
                    'first_name': 'Jane',
                    'last_name': 'Smith',
                    'address': '456 Elm St',
                    'phone': '0987654321',
                    'email': 'janesmith@example.com',
                    'salary': 250000,
                    'designation_id': test_designation.id
                }
            )
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['status'], True)
            self.assertEqual(data['status_message'], 'Employee updated successfully')
            self.assertEqual(data['data']['first_name'], 'Jane')
            self.assertEqual(data['data']['last_name'], 'Smith')

    def test_update_employee_missing_fields(self):
         with self.app.app_context():
            test_designation = Designation(
                name='Developer',
                leaves=30
            )
            db.session.add(test_designation)
            db.session.commit()
            test_employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=test_designation.id,
                deleted_at=None
            )
            db.session.add(test_employee)
            db.session.commit()
            response = self.client.put(
                f'/employees/{test_employee.id}',
                json={
                    'first_name': '',
                    'last_name': 'Smith',
                    'address': '456 Elm St',
                    'phone': '0987654321',
                    'email': 'janesmith@example.com',
                    'salary': 250000,
                    'designation_id': test_designation.id
                }
            )
            self.assertEqual(response.status_code, 400)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['status'], False)
            self.assertEqual(data['status_message'], 'Required fields are missing')
    def test_update_employee_invalid_salary(self):
        # Test updating an employee with an invalid salary value
        with self.app.app_context():
            # Add a test designation and employee
            test_designation = Designation(
                name='Developer',
                leaves=30
            )
            db.session.add(test_designation)
            db.session.commit()
            
            test_employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                designation_id=test_designation.id,
                salary=50000.0,
                deleted_at=None
            )
            db.session.add(test_employee)
            db.session.commit()
            
            # Perform update with invalid salary
            response = self.client.put(
                f'/employees/{test_employee.id}',
                json={
                    'first_name': 'Jane',
                    'last_name': 'Smith',
                    'address': '456 Elm St',
                    'phone': '0987654321',
                    'email': 'janesmith@example.com',
                    'designation_id': test_designation.id,
                    'salary': 'not_a_number'  # Invalid salary
                }
            )
            
            # Assert response status and data
            self.assertEqual(response.status_code, 400)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['status'], False)
            self.assertEqual(data['status_message'], 'Invalid salary value')
         
            
class AddCredentialTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_add_credential_success(self):
        with self.app.app_context():
            
            response = self.client.post(
                '/credential',
                json={
                    'username': 'newuser',
                    'password': 'newpassword',
                    'designation': 'Developer',
                    'phone': '1234567890',
                    'email': 'newuser@example.com',
                    'image_url': 'http://example.com/image.png'
                }
            )
           
            self.assertEqual(response.status_code, 201)
            data = response.get_json()
            self.assertTrue(data['status'])
            self.assertEqual(data['status_message'], 'Credential added successfully')
            self.assertEqual(data['data']['username'], 'newuser')
            
    def test_add_credential_missing_username_password(self):
        with self.app.app_context():
         response = self.client.post('/credential', json={
            'designation': 'Developer',
            'phone': '0987654321',
            'email': 'newuser@example.com',
            'image_url': 'http://example.com/newimage.png'
        })
         self.assertEqual(response.status_code, 400)
         data = response.get_json()
         self.assertFalse(data['status'])
         self.assertEqual(data['status_message'], 'Username and password are required')
    def test_add_credential_existing_username(self):
        with self.app.app_context():
            test_user = Credential(
                username='existinguser',
                designation='Developer',
                phone='1234567890',
                email='existinguser@example.com',
                image_url='http://example.com/image.png'
            )
            test_user.set_password('password')
            db.session.add(test_user)
            db.session.commit()
            response = self.client.post('/credential', json={
            'username': 'existinguser',
            'password': 'newpassword',
            'designation': 'Developer',
            'phone': '0987654321',
            'email': 'newuser@example.com',
            'image_url': 'http://example.com/newimage.png'
        })
            self.assertEqual(response.status_code, 409)
            data = response.get_json()
            self.assertFalse(data['status'])
            self.assertEqual(data['status_message'], 'Username already exists')
            
            
            
class UpdateEmployeeLeavesTestCase(unittest.TestCase):   
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
         
           

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

    def test_update_employee_leaves_success(self):
        with self.app.app_context():
            designation = Designation(
                name='Developer',
                leaves=20
            )
            db.session.add(designation)
            db.session.commit()

            employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=designation.id
            )
            db.session.add(employee)
            db.session.commit()

            leaves = Leave(
                employee_id=employee.id,
                leave_taken=5
            )
            db.session.add(leaves)
            db.session.commit()
            response = self.client.put(
            f'/employees/{employee.id}/leaves',
            json={'leave_taken': 10}
        )
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertEqual(data['message'], 'Leaves taken updated successfully')
        
            updated_leaves = db.session.query(Leave).filter_by(employee_id=employee.id).first()
            self.assertEqual(updated_leaves.leave_taken, 10)

    def test_update_employee_leaves_exceeds_allowed(self):
        with self.app.app_context():
            designation = Designation(
                name='Developer',
                leaves=20
            )
            db.session.add(designation)
            db.session.commit()

            employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=designation.id
            )
            db.session.add(employee)
            db.session.commit()

            leaves = Leave(
                employee_id=employee.id,
                leave_taken=5
            )
            db.session.add(leaves)
            db.session.commit()
            response = self.client.put(
            f'/employees/{employee.id}/leaves',
            json={'leave_taken': 25}
        )
            self.assertEqual(response.status_code, 400)
            data = response.get_json()
            self.assertEqual(data['error'], 'Leaves taken exceed allowed leaves for the designation')

    def test_update_employee_leaves_employee_not_found(self):
        with self.app.app_context():
            response = self.client.put(
            '/employees/999/leaves',
            json={'leave_taken': 10}
        )
            self.assertEqual(response.status_code, 404)
            data = response.get_json()
            self.assertEqual(data['message'], 'Employee not found')

    def test_update_employee_leaves_no_leave_record(self):
        with self.app.app_context():
            designation = Designation(
                name='Developer',
                leaves=20
            )
            db.session.add(designation)
            db.session.commit()

            new_employee = Employee(
            first_name='Jane',
            last_name='Doe',
            Address='456 Main St',
            phone='0987654321',
            email='janedoe@example.com',
            salary = 250000,
            designation_id=designation.id
        )
            db.session.add(new_employee)
            db.session.commit()

            response = self.client.put(
            f'/employees/{new_employee.id}/leaves',
            json={'leave_taken': 10}
        )
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertEqual(data['message'], 'Leaves taken updated successfully')
        
            new_leaves = db.session.query(Leave).filter_by(employee_id=new_employee.id).first()
            self.assertEqual(new_leaves.leave_taken, 10)
        
        
    
class LeaveTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            designation = Designation(
                name='Developer',
                leaves=20
            )
            db.session.add(designation)
            db.session.commit()

            employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=1
            )
            db.session.add(employee)
            db.session.commit()
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

    def test_create_leave_success(self):
        with self.app.app_context():
            designation = Designation(
                name='Tester',
                leaves=22
            )
            db.session.add(designation)
            db.session.commit()

            employee = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe123@example.com',
                salary = 250000,
                designation_id=1
            )
            db.session.add(employee)
            db.session.commit()
            response = self.client.post(
            '/leave',
            json={
                'leave_taken': 5,
                'employee_id': employee.id
            }
        )
            self.assertEqual(response.status_code, 201)
            data = response.get_json()
            self.assertEqual(data['message'], 'leaves created successfully')
            self.assertIn('id', data)

            new_leave = db.session.query(Leave).filter_by(id=data['id']).first()
            self.assertIsNotNone(new_leave)
            self.assertEqual(new_leave.leave_taken, 5)
            self.assertEqual(new_leave.employee_id, employee.id)
            
            
            
class LeaveListTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all() 
            
            
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()
            
    def test_get_leaves_success(self):
        with self.app.app_context():
            designation = Designation(
                name='Tester',
                leaves=22
            )
            db.session.add(designation)
            db.session.commit()
            employee1 = Employee(
                first_name='John',
                last_name='Doe',
                Address='123 Main St',
                phone='1234567890',
                email='johndoe@example.com',
                salary = 250000,
                designation_id=1
            )
           
            db.session.add(employee1)
            db.session.commit()

            leave1 = Leave(
                leave_taken=5,
                employee_id=employee1.id
            )
           
            db.session.add(leave1)
            db.session.commit()
            response = self.client.get('/leaves')
            self.assertEqual(response.status_code, 200)
            data = response.get_json()

            self.assertEqual(len(data), 1)   
            self.assertEqual(data[0]['firstname'], employee1.first_name)
            self.assertEqual(data[0]['last_name'], employee1.last_name)
            self.assertEqual(data[0]['leave_taken'], leave1.leave_taken)     
            
class LogoutTestCase(unittest.TestCase): 
   

    def create_app(self):
        app.config['SECRET_KEY'] = 'test_secret'
        app.config['SESSION_TYPE'] = 'filesystem'
        return app

    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
          
            test_user = Credential(username='testuser', designation='Developer', phone='1234567890', email='testuser@example.com', image_url='http://example.com/image.png')
            test_user.set_password('password')
            db.session.add(test_user)
            db.session.commit()
         
            self.client.post('/login', json={'username': 'testuser', 'password': 'password'})
            with self.client.session_transaction() as sess:
                sess['user_id'] = test_user.id
                sess['username'] = 'testuser'

    def tearDown(self):
      
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_logout(self):
        with self.client:
            response = self.client.post('/logout')
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.is_json)
            data = response.get_json()
            self.assertEqual(data['status'], True)
            self.assertEqual(data['status_message'], 'Logged out successfully')
            
           
            with self.client.session_transaction() as sess:
                self.assertNotIn('user_id', sess)
                self.assertNotIn('username', sess)

                        
        
if __name__ == '__main__':
    unittest.main()



