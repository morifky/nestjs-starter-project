## Description

A simple nestjs starter project, including integration with openAPI Swagger and postgres database

## Prerequisites
* Docker with support for Linux containers
* GNU Make

## Environment variables (mandatory)
* PORT

    Port the service listen on (e.g: 8080)

* REVISION_ID

    Image build ID (e.g current timestamp or version number)

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
$ make build
```

## Running the app

```bash
$ make run
