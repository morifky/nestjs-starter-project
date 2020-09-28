## Description

A simple nestjs starter project, including integration with openAPI Swagger and postgres database

## Prerequisites
* Docker
* GNU Make

## Environment variables
* PORT
    service HTTP port

* VERSION
    Image version

* DB_HOST
    Database host

* DB_USERNAME
    Database username

* DB_PASSWORD
    Database password

* DB_NAME
    Database name

* DB_PORT
    Database port

* MIGRATION_AUTO
    database auto migration

## Installation

```bash
$ make buildApplication
```

## Running the app

```bash
$ make runApplication
