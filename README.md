# ReadRecommend

## Setup

To initialise the application first install the required packages by running

```
poetry install
```

Once you are in an appropriate virtual environment, ensure you have books locally scraped from GoodReads by running :

```
python scraper.py
```
## Backend Setup
Ensure you have Postgres downloaded.
Start your postgres server in a seperate terminal.
Ensure you have a user and password created, as well as a database. Reflect these details in your .env file as for example:
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
