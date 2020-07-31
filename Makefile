.DEFAULT_GOAL = help

include .env
include .flaskenv
export

help:
	@echo "---------------------------ReadRecommend-----------------------------"
	@echo "make setup: download and install required tools, scrape dummy data"
	@echo "make clean: re-initialise database"
	@echo "make run: run the project"
	@echo "---------------------------------------------------------------------"

setup:
	@curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
	@poetry install
	@npm install --prefix frontend
	@make initialise
.PHONY: setup

initialise:
	@echo "Would you like to scrape data from Goodreads to initialse the database? [y/n]"
	@read line; if [ $$line = "y" ]; then @poetry run python scraper.py; fi
	@poetry run python setup.py
.PHONY: initialise

clean:
	@make initialise
.PHONY: clean

run:
	@make -j2 frontend backend

FRONTEND_PORT ?= 3000

frontend:
	@poetry run npm start --prefix frontend -l $(FRONTEND_PORT)
.PHONY: frontend

backend:
	@poetry run flask run
.PHONY: backend