// models/user.js
const db = require('../db');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0]; // Return the first user found with the given email
  }
  static async updatePhotoProfile(userId,photo) {
    const query = 'UPDATE users set photo = ? where id = ?';
    const [rows] = await db.query(query, [userId,photo]);
    return rows; // Return the first user found with the given email
  }
   static async findUserById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0]; // Return the first user found with the given email
  }
  static async findByUserName(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0]; // Return the first user found with the given email
  }
  static async findAllUsers() {
    const query = 'SELECT * FROM users';
    const [rows] = await db.query(query);
    const users = rows.map(user => {
        delete user.password;
        return user;
    });
    return users;
}
  

  static async create(firstName, lastName, email, username, password,gender,ip,birthdate,country,security_question,securityreply) {
    const query = 'INSERT INTO users (first_name, last_name, email, username, password,gender,ip,birthdate,country,security_question,security_reply) VALUES (?, ?, ?, ?,?, ?,?,?,?,?,?)';
    const [result] = await db.query(query, [firstName, lastName, email, username, password,gender,ip,birthdate,country,security_question,securityreply]);
    return result.insertId; // Return the ID of the newly created user
  }
  static async updateUser(user) {
    const { id, ...updateData } = user; // Destructure user object, exclude id
    const columns = Object.keys(updateData); // Get keys of updateData
    const values = Object.values(updateData); // Get values of updateData

    if (columns.length === 0) {
      throw new Error('No fields to update');
    }

    const placeholders = columns.map(column => `${column} = ?`).join(', '); // Create placeholders like "column1 = ?, column2 = ?"

    const query = `UPDATE users SET ${placeholders} WHERE id = ?`;
    const params = [...values, id]; // Combine values and id for the query parameters

    const [result] = await db.query(query, params);
    return result.affectedRows > 0; // Check if any rows were affected (updated)
  }
}

module.exports = User;
