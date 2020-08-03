.DEFAULT_GOAL = help

include .env
include .flaskenv

# Escape quoted environment variables 
VARS:=$(shell sed -ne 's/ *\#.*$$//; /./ s/=.*$$// p' .env )
$(foreach v,$(VARS),$(eval $(shell echo export $(v)="$($(v))")))
VARS:=$(shell sed -ne 's/ *\#.*$$//; /./ s/=.*$$// p' .flaskenv )
$(foreach v,$(VARS),$(eval $(shell echo export $(v)="$($(v))")))

help:
	@echo "---------------------------ReadRecommend-----------------------------"
	@echo "make setup: download and install required tools, scrape dummy data"
	@echo "make clean: re-initialise database"
	@echo "make run: run the project"
	@echo "---------------------------------------------------------------------"
.PHONY: clean

PYTHON_PATH ?= python
setup:
	@curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | $(PYTHON_PATH) - --version 1.0.9
	@. "$(HOME)/.poetry/env"
	@if [ $(PYTHON_PATH) != "python" ]; then\
		poetry env use $(PYTHON_PATH);\
	fi
	@poetry install
	@poetry run python -m nltk.downloader wordnet stopwords
	@npm install --prefix frontend
	@make initialise
.PHONY: setup

initialise:
	@echo "Would you like to scrape data from Goodreads to initialise the database? [y/n]"
	@read line; if [ $$line = "y" ]; then poetry run python scraper.py; fi
	@poetry run python setup.py
.PHONY: initialise

clean:
	@make initialise
.PHONY: clean

run:
	@make -j2 frontend backend
.PHONY: run

FRONTEND_PORT ?= 3000
frontend:
	@poetry run npm start --prefix frontend -l $(FRONTEND_PORT)
.PHONY: frontend

backend:
	@poetry run flask run
.PHONY: backend
