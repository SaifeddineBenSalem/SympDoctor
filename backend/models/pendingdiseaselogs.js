const db = require('../db');

class PendingDiseaseLogs {
    static async create(doctor, diseaseId, reply, comment, date,finale) {
        const query = 'INSERT INTO pendingdiseaseslogs (doctor, diseaseId, reply, comment, posting_date,finale) VALUES (?, ?,?,?,?,?)';
        const result = await db.query(query, [doctor, diseaseId, reply, comment, date,finale]);
        return result.insertId; // Return the ID of the newly created user
    }
    static async verifyHandler(userId,diseaseId) {
      const query = 'SELECT * FROM pendingdiseaseslogs WHERE doctor = ? and diseaseId = ?';
      const [result] = await db.query(query, [userId,diseaseId]);
      return result; // Return the ID of the newly created user
    }

    static async getReasonsByDiseaseId(diseaseId) {
      const query = 'SELECT * FROM pendingdiseaseslogs WHERE diseaseId = ? and finale=?';
      const [result] = await db.query(query, [diseaseId,0]);
      return result; // Return the ID of the newly created user
    }
    
}

module.exports = PendingDiseaseLogs;