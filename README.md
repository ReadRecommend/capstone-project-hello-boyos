# ReadRecommend

## Setup

## Backend Setup

The backend of ReadRecommend is a RESTful API written in flask that connects to a Postgres server. The following steps document how to set up the flask app, and insert data into the database.

Environment management for the Python backend is handled with [poetry](https://python-poetry.org/docs/). Once you have poetry installed, run the following to create a virtual environment and install the required dependencies:

```
poetry install
```

Once you have configured your virtual environment, ensure you have books locally scraped from GoodReads by running :

```
python scraper.py
```

Ensure you have Postgres downloaded.
Start your postgres server in a seperate terminal.
Ensure you have a user and password created, as well as a database. Reflect these details in a .env file located in the root directory:

```
export POSTGRES_USER="postgres"
export POSTGRES_PORT="5432"
export POSTGRES_PASSWORD="test123"
export POSTGRES_DATABASE="test"
export DATABASE_URL="postgresql://postgres:test123@localhost/test"
```

Next, run

```
python setup.py
```

to configure the Postgres database appropriately. This can be done whenever you would like to refresh the database to a clean state.

At this point all setup is complete, and the Flask API can be activated by running

```
flask run
```

## Frontend Setup

Ensure you have NodeJs downloaded. Then navigate to the frontend folder and run

```
npm install
```

Make sure the backend is already running, by following the above steps.
Next, in the frontend folder run

```
npm start
```

At this point the website should pop up in your browser.

## Cleaning up

When you have finished, make sure you shut down the backend, frontend, and postgresql server
