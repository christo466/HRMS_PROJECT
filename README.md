# HRMS PROJECT

## Flask

### To create credentials:
- Navigate to flask_hrms
- First run ```flask --app hr run --debug```
- Type this command :
  ```python3 register.py```
- It will automatically Create a new username and password

### Current credentials to log in:

-    username = CHRISTO
-   password = christo466@

### To register new credentials using Postman:

-    Endpoint: http://127.0.0.1:5000/credential

### JSON data model for registering credentials using Postman:

- {
      "username":"CHRISTO",
      "password":"christo466@"
    }

### local host:
-  http://127.0.0.1:5000
### Requirements
- ```requirements.txt``` file is pushed to git hub. install all the requirements packages from it. 

## React 
### Install npm :
- sudo apt update
- sudo apt install nodejs npm
### Creating vite project:
- npm create vite@latest

### Running vite project:
- npm install
- npm run dev 
### Port:
- http://localhost:5173
 
## Unittest
- Create a new database and setup in hr.py and model
- Run this command for testing code :
 ```python -m unittest test_hr.py```
- Navigate to the flask_hrms folder from the HRMS_PROJECT folder and type these below commands in the terminal.
- ```pip install coverage```.
- ```coverage run -m unittest discover```.
- ```coverage report```.
- ```coverage html```.


