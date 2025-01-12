// var http = require('http');
// const url = require('url');
// const dotenv = require('dotenv');
const db = require('./db')
const express = require('express');
require('dotenv').config()
const cors = require('cors')
const app = express();
const listrouter = require('./routes/user')
const profilerouter = require("./routes/profile")
const connectionrouter = require("./routes/connection")
// dotenv.config()
// const {Pool} = require('pg')

db.connectToPostgres();
// // PostgreSQL Pool Setup
// const pool = new Pool({
//     user: process.env.DB_USER || 'postgres',
//     host: process.env.DB_HOST || 'localhost',
//     database: process.env.DB_NAME || 'mentorship',
//     password: process.env.DB_PASSWORD || '123456',
//     port: process.env.DB_PORT || 5432,
// });
// pool.connect().then(()=> console.log("connected"))

// const PORT = process.env.PORT||5000
app.use(cors({
  // origin:"https://mentorship-platfrom-backend.vercel.app/"
}))
app.use(express.json());

app.get('/api/users', listrouter.getUsers)
app.get('/api/users/:id', listrouter.getUserbyId)
app.post('/api/token', listrouter.getIdbyToken)
app.post('/api/Createuser', listrouter.createUser)
app.post('/api/Deleteuser/:id', listrouter.deleteUser)
app.post('/api/loginUser', listrouter.loginUser)
app.post('/api/Updateuser/:id', listrouter.updateUser)

app.post('/api/Createprofile/:id', profilerouter.createProfile)
app.post('/api/Updateprofile/:id', profilerouter.updateprofile)

app.get('/api/Connections/:id', connectionrouter.Connections)
app.get('/api/CheckConnection/:mentor_id/:mentee_id', connectionrouter.checkConnection)
app.post('/api/ConnectionRequest', connectionrouter.ConnectionRequest)
app.post('/api/UpdateConnectionRequest', connectionrouter.updateConnection)

app.get('/', (req, res) => {
    res.send('Hello World Mentorship!');
  });
  
// app.listen(PORT,() => {
//     console.log(`Mentorship platform backen running on port http://localhost:${PORT}/`);
//   });

module.exports = app

// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "*.js",
//       "use": "@vercel/node"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/(.*)",
//       "dest": "/",
//       "methods":["GET","POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//           "headers":{
//               "Access-Control-Allow-Origin": "*"
//           }
//     }
//   ]
// }  