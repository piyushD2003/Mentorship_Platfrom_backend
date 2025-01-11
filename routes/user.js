const db = require("../db")

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'piyushisgoodboy'
const bcrypt = require('bcryptjs')
const jwtDecode =  require('jwt-decode');
const { body, validationResult } = require('express-validator');


const getUsers = async (req, res) =>{
  let users = await db.pool.query('SELECT u.id AS user_id, u.username, u.email, p.role, p.skills, p.interests, p.Organisation, p.position, p.year_experience, p.experience, p.education, p.social_links, p.bio, p.image, p.updated_at FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.id ASC')
  res.status(200).json(users.rows)
}

const getUserbyId = async (req, res) =>{
  let users = await db.pool.query('SELECT u.id AS user_id, u.username, u.email, p.role, p.skills, p.interests, p.Organisation, p.position, p.year_experience, p.experience, p.education, p.social_links, p.bio, p.image, p.updated_at FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = $1',[req.params.id])
  res.status(200).json(users.rows[0])
}



const getIdbyToken = async (req, res) =>{
  const decodedToken = jwtDecode(req.body['authToken']);

    // Extract the user ID
  const userId = decodedToken.user.id;

  console.log('User ID:', userId);

  const decoded = jwt.verify(req.body['authToken'], JWT_SECRET)
  console.log(decoded.user.id);
  
  res.status(200).json(decoded)
}
const createUser = async (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
  }

  const {name,email,password} = req.body
  
  const salt = await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(password, salt)

  let user = await db.pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
    [name, email, secPass])

  console.log(user);
  
  const data = {
    user: {
        id: user.rows[0].id
    }
}
  const authToken = jwt.sign(data, JWT_SECRET)
  return res.status(200).json({"status":"Created successfully",authToken})
}



const loginUser = async (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  const { email, password } = req.body
  console.log(email, password);
  
  let user = await db.pool.query('SELECT * FROM users WHERE email = $1',[email])
  if(!user){
    return res.status(400).json({ errors: "Please try to login with correct credentials" })
  }
  const passwordCompare = await bcrypt.compare(password, user.rows[0].password)
  if (!passwordCompare) {
    return res.status(400).json({errors: "Please try to login with correct credentials" })
  }
  
  const data = {
    user: {
        id: user.rows[0].id
    }
}
  const authToken = jwt.sign(data, JWT_SECRET)
  return res.status(200).json({"status":"Login successfull","id":user.id,authToken})
}

const updateUser = async(req, res) =>{
  const id = parseInt(req.params.id)

  let user = await db.pool.query('SELECT * FROM users WHERE id = $1',[id])
  if(user.rows.length === 0){
    return res.status(400).json({ errors: "User Not Exist" })
  }

  const { username, email, password } = req.body
  console.log(req.body)
  const salt = await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(password, salt)

  db.pool.query(
    'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
    [username,email,secPass, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json({"detai":`User modified with ID: ${id}`, results})
    }
  )
}



const deleteUser = async (req, res) =>{
  const id = req.params.id
  let user = await db.pool.query('SELECT * FROM users WHERE id = $1',[id])
  if(user.rows.length === 0){
    return res.status(400).json({ errors: "User Not Exist" })
  }

  
  db.pool.query('DELETE FROM users WHERE id = $1',[id],
    (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(`User deleted with ID: ${id}`)
  })
}
module.exports = {
    getUsers,
    getUserbyId,
    getIdbyToken,
    loginUser,
    createUser,
    updateUser,
    deleteUser,
  }