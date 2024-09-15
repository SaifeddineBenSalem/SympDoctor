const db = require('../db');
class pendingDisease {
    static async create(userId, name, date) {
        const query = 'INSERT INTO pendingdiseases (poster, name, posting_date) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [userId, name, date]);
        return result.insertId; // Return the ID of the newly created user
      }
    static async findByDiseaseName(name) {
        const query = 'SELECT * FROM pendingdiseases WHERE name = ?';
        const [result] = await db.query(query, [name]);
        return result; // Return the ID of the newly created user
      }
      static async findById(id) {
        const query = 'SELECT * FROM pendingdiseases WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result; // Return the ID of the newly created user
      }
      static async getDiseaseByDiseaseName(diseaseName) {
        const query = 'SELECT * FROM pendingdiseases WHERE name = ?';
        const [result] = await db.query(query, [diseaseName]);
        return result; // Return the ID of the newly created user
      }
      static async update(user) {
        const { id, ...updateData } = user; // Destructure user object, exclude id
        const columns = Object.keys(updateData); // Get keys of updateData
        const values = Object.values(updateData); // Get values of updateData
    
        if (columns.length === 0) {
          throw new Error('No fields to update');
        }
    
        const placeholders = columns.map(column => `${column} = ?`).join(', '); // Create placeholders like "column1 = ?, column2 = ?"
    
        const query = `UPDATE pendingdiseases SET ${placeholders} WHERE id = ?`;
        const params = [...values, id]; // Combine values and id for the query parameters
    
        const [result] = await db.query(query, params);
        return result.affectedRows > 0; // Check if any rows were affected (updated)
      }

      
    static async accept(userId,diseaseId,dateString1) {
      const query = 'UPDATE pendingdiseases SET status = ? , action_taker=? , action_date=? where id = ?';
      const [result] = await db.query(query, ["Accepted",userId,dateString1,diseaseId]);
      return result.affectedRows > 0; // Check if any rows were affected (updated)
  }
}
module.exports = pendingDisease;
