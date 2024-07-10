from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String,DateTime
from sqlalchemy.orm import mapped_column
import logging
from typing import List
from sqlalchemy import ForeignKey
from datetime import datetime,timezone
from sqlalchemy import  create_engine, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase,Mapped, sessionmaker, relationship
from werkzeug.security import generate_password_hash
class Base(DeclarativeBase):
  def __repr__(self):
    return f"{self.__class__.__name__}(id={self.id})"

db = SQLAlchemy(model_class=Base)



class Designation(Base):
    __tablename__ = "designation"
    __table_args__= (UniqueConstraint('name'),)
    id    : Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    leaves: Mapped[int] = mapped_column()
    employee: Mapped[List["Employee"]] = relationship("Employee", back_populates="designation",cascade="all, delete-orphan")
    
class Employee(Base):
    __tablename__ = "employee"
    __table_args__= (UniqueConstraint('phone','email'),)
    id    : Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    Address: Mapped[str] = mapped_column(String(50))
    phone: Mapped[str]= mapped_column(String(30))
    email: Mapped[str]= mapped_column(String(50))
    designation_id: Mapped[int] = mapped_column(ForeignKey('designation.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    designation: Mapped["Designation"] = relationship("Designation", back_populates="employee")
    leaves = relationship("Leave", uselist=False, back_populates="employees")
    
class Leave(Base):
    __tablename__ = "leave"
    __table_args__= (UniqueConstraint('employee_id'),)
    id    : Mapped[int] = mapped_column(primary_key=True)
    leave_taken: Mapped[int] = mapped_column()
    employee_id: Mapped[int] = mapped_column(ForeignKey('employee.id'))
    employees = relationship("Employee", back_populates="leaves")
    
class Credential(Base):
    __tablename__ = "credential"
    __table_args__= (UniqueConstraint('username','password'),)
    id    : Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(60), nullable=False)
    _password: Mapped[str] = mapped_column("password", String(255), nullable=False)
    # def set_password(self, password):
    #     self._password = generate_password_hash(password)

    
def init_db(db_uri='postgresql://postgres:christo466@localhost:5432/flaskdb'):
    logger = logging.getLogger("FlaskApp")
    engine = create_engine(db_uri)
    Base.metadata.create_all(engine)
    logger.info("Created database")

def get_session(db_uri):
    engine = create_engine(db_uri)
    Session = sessionmaker(bind = engine)
    session = Session()
    return session

    
    
    
    
    