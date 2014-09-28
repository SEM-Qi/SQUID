## What is this?
This server provides the log-in functionality for SQUID.
The users drones are displayed, the available drones are marked blue.
The user gets redirected to the drone when clicking it.

## Instructions

To set up the server (on qi.homeip.net) with authentification security 
and the drone management tools please follow these steps:

1. install node and mongodb
2. type mongod --dbpath "../path/to/folder/data/db" to create the database
3. run the server from the folder by typing node server.js (or nodejs server.js)


## File structure

