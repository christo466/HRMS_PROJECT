from sqlalchemy import create_engine, UniqueConstraint, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from werkzeug.security import generate_password_hash, check_password_hash

# Define the base class for declarative models
Base = declarative_base()

# Define the Credential model
class Credential(Base):
    __tablename__ = "credential"
    # Corrected UniqueConstraint to use 'password'
    __table_args__ = (UniqueConstraint('username', 'password'),)

    id = Column(Integer, primary_key=True)
    username = Column(String(60), nullable=False)
    _password = Column("password", String(255), nullable=False)
    designation = Column(String(50), nullable=False)
    phone = Column(String(30))
    email = Column(String(50))
    image_url = Column(String(255))

    def set_password(self, password):
        self._password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._password, password)

# Database connection parameters
# Use localhost if it's on the same machine or the IP address for the server
server = 'localhost'
# Database name in PostgreSQL
database = 'flaskdb'
# Username in PostgreSQL
user = 'postgres'
# Password in PostgreSQL
password = 'christo466'
# Port number configured for PostgreSQL, 5432 is the default port
port = 5432

# Create the database engine
engine = create_engine(f'postgresql://{user}:{password}@{server}:{port}/{database}')

# Create a session factory bound to the engine
Session = sessionmaker(bind=engine)

# Data to be inserted
username_input = 'CHRISTO'
password_input = 'christoaj466@'
designation_input = 'HUMAN RESOURCE'
phone_input = '7356379662'
email_input = 'christoaj466@gmail.com'
image_url_input = 'https://lh3.googleusercontent.com/a/ACg8ocJQuVrhka8EcRIK72oX3iTblfK1lvxKSp-bgpP2s3ekDV4V-QmZ=s288-c-no'

try:
    # Create a new session
    session = Session()

    # Create a new credential instance
    new_credential = Credential(
        username=username_input,
        designation=designation_input,
        phone=phone_input,
        email=email_input,
        image_url=image_url_input
    )

    # Set the password using the model's method
    new_credential.set_password(password_input)

    # Add the new credential to the session
    session.add(new_credential)

    # Commit the transaction
    session.commit()
    print("Data inserted successfully.")

except Exception as error:
    print(f"Error: {error}")
    session.rollback()  # Rollback the transaction in case of error

finally:
    # Close the session
    session.close()
    print("Database session closed.")
