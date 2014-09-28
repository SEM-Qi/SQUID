## Instructions

To set up the server (on qi.homeip.net) with authentification security 
and the drone management tools please follow these steps:

1. install node and mongodb
2. type mongod --dbpath "../path/to/folder/data/db" to create the database
3. run the server from the folder by typing node server.js (or nodejs server.js)


## File structure

-- app

------ models

---------- user.js 	    
**our user model** 
                          
------ routes.js 	           
**all the routes for our application**

-- config

------ auth.js 			
**will hold all our client secret keys (facebook, twitter, google)**

------ database.js 	
**will hold our database connection settings**

------ passport.js 		
**configuring the strategies for passport**

-- public

------ views

---------- index.html 		
**show our home page with login option**

---------- signup.html 		
**signup form**

---------- manage.html		
**manage quads window**

------ css

---------- style.css		
**the idividual styles for the app**

------ js

---------- checkIP.js		
**check the ip.json file for values**

---------- ip.json		
**store the ip and the ID of the Quad**

---------- bootstrap.min.js 	
**additional visuals for bootstrap**

-- package.json 		
**handle our npm packages**

-- server.js 			
**setup our application**





