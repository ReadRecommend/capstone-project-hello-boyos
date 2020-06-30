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

### Postgres Setup

Ensure you have Postgres [downloaded](https://www.postgresql.org/download/).
Start your postgres server in a seperate terminal. The exact method of starting Postgres varies by operating system:

- [MacOS](https://chartio.com/resources/tutorials/how-to-start-postgresql-server-on-mac-os-x/)
- [Windows](https://stackoverflow.com/questions/36629963/how-can-i-start-postgresql-on-windows)
- [Arch](https://wiki.archlinux.org/index.php/PostgreSQL)
- [Ububtu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)

Make sure you have a user and password created, as well as a database. Reflect these details in a .env file located in the root directory. An example of such a file would be:

```shell
export POSTGRES_USER="postgres"
export POSTGRES_PORT="5432"
export POSTGRES_PASSWORD="test123"
export POSTGRES_DATABASE="test"
export DATABASE_URL="postgresql://postgres:test123@localhost/test"
```

### Flask setup

Once the Postgres server is running and you have configured your `.env` file we can configure the Flask application. Run

```
python setup.py
```

to configure the flask applications database and load in some dummy data. This can be done whenever you would like to refresh the database to a clean state.

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
