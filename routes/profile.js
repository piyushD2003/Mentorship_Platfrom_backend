const db = require("../db")

const createProfile = async (req, res) =>{
    const {role,skills, interests,Organisation, position, year_experience, experience, education, social_links, bio} = req.body
    const id = req.params.id
    let user = await db.pool.query('SELECT * FROM users WHERE id = $1',[id])
    if(user.rows.length === 0){
      return res.status(400).json({ errors: "User Not Exist" })
    }
    console.log(req.body);
    
    let userprofile = await db.pool.query('INSERT INTO profiles (user_id, role, skills, interests,Organisation, position, year_experience, experience, education, social_links, bio) VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9, $10, $11) RETURNING id',
      [id, role, skills, interests,Organisation, position, year_experience, experience, education, social_links, bio])
  
    console.log(userprofile.rows[0]);
    return res.status(200).json({"status":"Profile Created successfully"})
}

const updateprofile = async(req, res) =>{
  const id = parseInt(req.params.id)

  let userprofile = await db.pool.query('SELECT * FROM profiles WHERE user_id = $1',[id])
  if(userprofile.rows.length === 0){
    return res.status(400).json({ errors: "User Not Exist" })
  }

  const {role,skills, interests, Organisation, position, year_experience, experience, education, social_links, bio} = req.body
  console.log(req.body)

  db.pool.query(
    'UPDATE profiles SET role = $1, skills = $2, interests = $3, Organisation =$4, position = $5, year_experience = $6, experience=$7, education=$8, social_links =$9, bio = $10 WHERE user_id = $11',
    [role,skills, interests,Organisation, position, year_experience, experience, education, social_links, bio, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json({"detai":`User modified with ID: ${id}`, results})
    }
  )
}


module.exports = {
    createProfile,
    updateprofile,
}