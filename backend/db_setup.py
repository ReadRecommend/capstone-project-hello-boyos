import psycopg2
import os

# You will probably need to set up your own user, password and database on your own machine
conn = psycopg2.connect(user = "postgres",
                                password = "test123",
                                host = "localhost",
                                port = "5432",
                                database = "test")
print(conn) # state of connection after opening
cur = conn.cursor()

# Create all the tables from the schema
schemafile = open(os.getcwd() + '/backend/database/schema.sql', 'r')
cur.execute(schemafile.read())
conn.commit()

# Add data to the tables
datafile = open(os.getcwd() + '/backend/database/data.sql', 'r')
cur.execute(datafile.read())
conn.commit()

conn.close()
print(conn) # state of connection after closing

