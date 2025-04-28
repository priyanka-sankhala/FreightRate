# FreightRate
### Project setup 
1. git clone https://github.com/priyanka-sankhala/FreightRate.git
2. cd FreightRate

## for frontend setup
3. cd frontend
## install the dependency 
4. npm install
## copy the .env file 
5. cp .env_example .env
## update the api url (banckend server path)
## start the react server 
10. npm start
The frontend will be available at http://localhost:3000 by default.


## for backend setup
6. cd server 
## install the dependency 
7. npm install
## copy the .env file 
8. cp .env_example .env
## update the databse creditials 
## run the migtration script 
9. npm run migrations
## start the node server 
10. npm start
The backend server will typically run on http://localhost:5000 



Container Types: In some Excel files, columns like 20’GP and 40’GP represent different container types. Each row may correspond to multiple entries based on these types.

Layout Adjustments: Minor layout changes were made during development. Notably, the upload modal was expanded to full width to accommodate Excel files with more than eight columns, ensuring better data visualization.

Column Mapping: A column mapping feature is included at the end to facilitate easy identification and alignment of data fields.