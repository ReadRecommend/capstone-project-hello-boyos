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

Make sure the backend is already running, by following the above steps. Next, run
```
npm start
```

At this point the website should pop up in your browser.
