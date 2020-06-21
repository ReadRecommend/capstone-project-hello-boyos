import psycopg2

conn = psycopg2.connect(
    user="postgres", password="test123", host="localhost", port="5432", database="test"
)

# Print state of connection after opening
print(conn)
cur = conn.cursor()

print("Deleting all existing tables")
cur.execute("DROP SCHEMA public CASCADE;")

print("Creating public schema")
cur.execute("CREATE SCHEMA public;")
conn.commit()
cur.close()
conn.close()

from backend import db
from backend.database.json_to_db import json_to_db

print("Creating tables and loading in data")
db.create_all()
json_to_db("books.json")

print("Setup complete!")
