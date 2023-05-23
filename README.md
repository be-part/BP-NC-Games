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
Reviews contain information about various board games (both the classics and the lesser-knowns) and find useful information about them including who designed them, a description of the game and sometimes a 'helpful' image.
Users may comment on reviews and either upvote or downvote them allowing for engagement and spirited debates on everything board game!

:question: [Further information about where this project came from](#further-information)

## Minimum Requirements
:warning:

## Link to hosted version

https://nc-games-bp.onrender.com/api/ 


## Part 1: Cloning

Copy the link for this repo from GitHub and then clone it into your desired location by typing `git clone repo_link_here` into your terminal.


## Part 2: Installing dependencies

In your terminal, type `npm install` to install the required dependencies for this repo, including:
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
A number of scripts have been set up for you in the package.json including one to set up the test and development databases and seed them. Type the following into your terminal:

* `npm run setup-dbs` - to setup your databases  
* `npm run seed` - to seed your databases with the data


## Part 4: Running tests
To run the tests there are two options:
Tests have been divided into app tests (app.test.js) and utility tests (utils.test.js)
To run all of the tests you can use the prewritten script in the package.json by typing `npm run test` in the termimal.

To specifically run either app tests or utility tests, type the following into your terminal;  

`npm run test app.test.js`  
`npm run test utils.test.js`  

respectively. 


## Part 5: Connecting Locally

To connect to the two databases locally, you must add two files:

> .env.tests  
> .env.development

These files need to contain the following text:

> PGDATABASES=name_of_database

Where **name_of_database** is the names of the databases you have been given to connect to.


## Further Information

This project was created during participation in Northcoders Bootcamp. Using their framework, I built a backend project over the course of several days and weeks to improve my Javascript, Express, Jest and SuperJests skills - as well as to later incorporate it in a front-end project. 


[Back to top](#bp-house-of-games-api)