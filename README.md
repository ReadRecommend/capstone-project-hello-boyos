# ReadRecommend

ReadRecommend is a book recommendation and book catalogue web application. It is made up of three main components. A [Postgresql](https://www.postgresql.org/) database stores information accessed by a RESTful API implemented with [Flask](https://flask.palletsprojects.com/en/1.1.x/). While the API is directly accessible, a web frontend is implemented in [React.js](https://www.postgresql.org/).

## Setup

### Postgres Database

Ensure you have Postgres [downloaded](https://www.postgresql.org/download/) on to your machine.
Start your Postgres server in a separate terminal, or configure it to run in the background. The exact method of starting Postgres varies by operating system:

-   [MacOS](https://chartio.com/resources/tutorials/how-to-start-postgresql-server-on-mac-os-x/)
-   [Windows](https://stackoverflow.com/questions/36629963/how-can-i-start-postgresql-on-windows)
-   [Arch](https://wiki.archlinux.org/index.php/PostgreSQL)
-   [Ububtu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)

Once you have postgres running, create a username, password, and an empty database. The instructions [here](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) provide a general guide, although it may differ on your OS. Remember the details of your postgres setup, as they will be used in the next section

## Configuration

To configure the settings of ReadRecommend, a `.env` file is used. In the root folder create a file named `.env`, which will be used to store your specific configuration settings. Some public settings are also stored in the `.flaskenv` file for the backend API. You can override these by placing alternate values in your own `.env` file. In general, the hierarchy of configuration goes `.env` --> `.flaskenv` --> `backend/config.py`.

The following variables are supported in the `.env` file:

| Variable             | Description                                                  | Default Value                                                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `POSTGRES_USER`      | The username of the Postgres user used to access the database | postgres                                                     |
| `POSTGRES_PORT`      | The port the Postgres database runs on                       | 5432                                                         |
| `POSTGRES_PASSWORD`  | The password associated with `POSTGRES_USER`                 | test123                                                      |
| `POSTGRES_DATABASE`  | The name of the Postgres database to connect to              | test                                                         |
| `DATABASE_URL`       | The url of the postgres database, should have the form postgresql://POSTGRES_USER:POSTGRES_PASSWORD@hostname/POSTGRES_DATABASE | postgresql://postgres:test123@localhost/test                 |
| `SECRET_KEY`         | The secret key used for cryptographic signing of cookies. **Must be changed from default in production** | **Do not use default in production**                         |
| `JWT_PLACES`         | Locations to look for a JWT token. Should be one string, with places seperated by commas. (See [flask-praetorian](https://flask-praetorian.readthedocs.io/en/latest/notes.html) documentation for more info) | cookie,header                                                |
| `JWT_ACCESS_MINUTES` | The number of minutes a JWT token allows access to protected routes. (see [flask-praetorian](https://flask-praetorian.readthedocs.io/en/latest/notes.html) documentation for more info) | 30                                                           |
| `JWT_REFRESH_DAYS`   | The number of days a JWT token can be refreshed once it has expired. (see [flask-praetorian](https://flask-praetorian.readthedocs.io/en/latest/notes.html) documentation for more info) | 7                                                            |
| `INITIAL_DATA`       | A path pointing to a .json file containing book data. Such a file will be autegenerated when running `make setup` at this location | books.json                                                   |
| `FLASK_RUN_HOST`     | The host to run the Flask application on                     | localhost                                                    |
| `FLASK_RUN_PORT`     | The port to run the Flask application on                     | 5000                                                         |
| `FRONTEND_PORT`      | The port to run the React application on                     | 3000                                                         |
| `BROWSER`            | The browser to open the react app in. WIll be ignored if application is configured for production | Will use system default browser                              |
| `PYTHON_PATH`        | The path to a python executable to use for the project. Must be `>=3.8.0, <=3.8.3`. Useful if the default version of python on your `PATH` is not compatible. Can either be a full path to the executable like `path/to/python`, or if the python executable is already inm your path (e.g. as `python3.8`) you can simply set to `python3.8` | By default will use the version attatched to `python` in your `PATH` |

**Note:** A `.env` file is required, with at least a new secret key

### Example `.env` File

An example of a `.env` file might be:

```shell
POSTGRES_USER="myuser"
POSTGRES_PORT=9999
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="readrecommend"
DATABASE_URL="postgresql://myuser:password@localhost/readrecommend"
SECRET_KEY="very_secret_key"
JWT_ACCESS_MINUTES=15
BROWSER="chromium"
```

## Make

ReadRecommend comes with a `Makefile` to make installing and running the application as simple as possible. Before running the any `make` commands however, both Python (>=3.8.0, <=3.8.3) and Node.js need to be installed. These can be found at the following links:

-   [Python](https://www.python.org/downloads/)

-   [Node](https://nodejs.org/en/download/)

### Setup

Once Node and Python have been installed, run:

```shell
make setup
```

This will install all necessary tools and packages, as well as create the appropriate virtual environments.

Additionally, it will ask if you would like to scrape some dummy data from Goodreads. Input either `y` or `n` to continue. If you select `y`, a few prompts will appear asking for how many books to scrape, and from which Goodreads list. Once the scraping has completed, the books will be written out to the path specified in `INITIAL_DATA`.

After this step, the database will be initialised, and you will be prompted to create an administrator account, as well as given the option to create two "dummy" users in the system.

### Run

Once the previous steps have been followed, simply run the following to start ReadReccomend!

```shell
make run
```

### Clean

If for any reason you would like to simply wipe the database and re-initialise the application, without reinstalling packages or setting up environments, simply run:

```shell
make clean
```

You will still have the option of scraping books if you wish.
