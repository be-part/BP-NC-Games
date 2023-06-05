# BP House of Games API :game_die:

## Contents
[Introduction](#introduction)  

[Where did this project come from and why did you make it?](#further-information)

[Link to hosted version](#link-to-hosted-version)  

[Part 1: Cloning](#part-1-cloning)  

[Part 2: Installing dependencies](#part-2-installing-dependencies)  

[Part 3: Seeding the local databases](#part-3-seeding-the-local-databases)

[Part 4: Running tests](#part-4-running-tests)

[Part 5: Connecting locally](#part-5-connecting-locally)



## Introduction

This is an API that allows you to search through reviews of different board games.  
It is built with express and Postgres.  
Reviews contain information about various board games (both the classics and the lesser-knowns) with useful information about them including who designed them, a description of the game and sometimes a 'helpful' image.
Users may comment on reviews and either upvote or downvote them allowing for engagement and spirited debates on everything board game!

:question: [Further information about where this project came from](#further-information)

## Minimum Requirements
:warning: 
Node: v19.8
Postgres: 14.8

## Link to hosted version

https://nc-games-bp.onrender.com/api/ 


## Part 1: Cloning

Copy the link for this repository from GitHub and then clone it into your desired location using:  
`git clone https://github.com/be-part/BP-NC-Games.git`


## Part 2: Installing dependencies

Type `npm install` to install the required dependencies for this repo, including:
* dotenv
* express
* pg
* pg-format
* husky
* jest
* jest-extended
* jest-sorted
* supertest


## Part 3: Seeding the local databases
To set up the test and development databases and seed them, type the following:

* `npm run setup-dbs` - to setup your databases  
* `npm run seed` - to seed your databases with the data


## Part 4: Running tests
Tests have been divided into app tests (app.test.js) and utility tests (utils.test.js)
To run all of the tests you can use `npm run test`

To specifically run either app tests or utility tests, use the following;  

`npm run test app.test.js`  
`npm run test utils.test.js`  

respectively. 


## Part 5: Connecting Locally

To connect to the two databases locally, you must add two files:

> .env.tests  
> .env.development

These files need to contain the following text:

> PGDATABASES=name_of_database

Where **name_of_database** is the name of the database you have been given to connect to.


## Further Information

This project was created during participation in Northcoders Bootcamp. Using their framework, I built a backend project over the course of several days and weeks to improve my Javascript, Express, Jest and SuperJests skills - as well as to later incorporate it in a front-end project. 


[Back to top](#bp-house-of-games-api)