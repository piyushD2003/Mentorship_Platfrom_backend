const db = require("../db")

const Connections = async (req, res) => {
  const { id } = req.params
  console.log("ID",id)
  try {
    const result = await db.pool.query(`
      SELECT connections.id, users.username AS sender_name, connections.status 
      FROM connections 
      JOIN users ON connections.sender = users.id 
      WHERE connections.receiver = $1 AND connections.status = 'pending';
    `, [id]);
    console.log(result.rows);
    
    res.json(result.rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching connections' });
  }

}
const checkConnection = async (req, res) => {
  try {
    const { mentor_id, mentee_id } = req.params; // Get mentor and mentee IDs from request parameters
    console.log(mentee_id, mentor_id)
    if (!mentor_id || !mentee_id) {
      return res.status(400).json({ error: "Both mentorId and menteeId are required." });
    }

    const query = `
      SELECT 
        id,sender, receiver, status, created_at
      FROM 
        connections
      WHERE 
        sender = $1 AND receiver = $2
    `;

    const result = await db.pool.query(query, [mentor_id, mentee_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No connection found between the mentor and mentee." });
    }

    res.status(200).json({
      message: true,
      connection: result.rows[0]
    });
  } catch (error) {
    console.error("Error checking connection:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const ConnectionRequest = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Ensure mentor_id and mentee_id are not the same
    if (sender === receiver) {
      return res.status(400).json({ error: "Mentor and mentee cannot be the same." });
    }

    // Insert connection request
    const result = await db.pool.query(
      `INSERT INTO connections (sender, receiver) 
         VALUES ($1, $2) 
         RETURNING id,sender, receiver, status, created_at`,
      [sender, receiver]
    );

    return res.status(201).json({
      message: "Connection request sent successfully.",
      connection: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation
      return res.status(400).json({ error: "Connection request already exists." });
    }
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateConnection = async (req, res) => {
  try {
    const { connection_id, status } = req.body;

    // Validate the status value
    const validStatuses = ["pending", "accepted", "declined"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    // Update the status in the database
    const result = await db.pool.query(
      `UPDATE connections 
         SET status = $1 
         WHERE id = $2 
         RETURNING id, sender, receiver, status, created_at`,
      [status, connection_id]
    );

    // Check if the connection exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Connection request not found." });
    }

    return res.status(200).json({
      message: "Connection status updated successfully.",
      connection: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  Connections,
  checkConnection,
  ConnectionRequest,
  updateConnection,
}