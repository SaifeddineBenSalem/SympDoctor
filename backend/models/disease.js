const db = require('../db');
class Disease {
    static async create(userId, disease, date,country) {
        const query = 'INSERT INTO disease (userid, disease, date,country) VALUES (?, ?, ?,?)';
        const [result] = await db.query(query, [userId, disease, date,country]);
        return result.insertId; // Return the ID of the newly created user
      }
    static async getDiseasesByUser(id) {
        const query = 'SELECT * FROM disease WHERE userId = ?';
        const [result] = await db.query(query, [id]);
        return result; // Return the ID of the newly created user
      }
    static async getAllDiseases(id) {
        const query = 'SELECT * FROM disease ';
        const [result] = await db.query(query);
        return result; // Return the ID of the newly created user
      }
     
}
module.exports = Disease;
