const db = require('../db');
class DoctorApplication{
    static async create(applicant,fileName, posting_date) {
        const query = 'INSERT INTO doctor_applicartions (applicant, fileName,posting_date) VALUES (?, ?,?)';
        const [result] = await db.query(query, [applicant, fileName,posting_date]);
        return result.insertId; // Return the ID of the newly created user
      }
      static async getAllApplications() {
        const query = 'SELECT * from doctor_applicartions'; // Fixed typo in table name
        const [result] = await db.query(query); // Removed unnecessary parameters
        return result;
      }
      static async declineApplication(appId,reason,status) {
        const query = 'UPDATE doctor_applicartions set status = ? , reason =? where id = ?';
        const [rows] = await db.query(query, [status,reason,appId]);
        return rows; // Return the first user found with the given email
      }
      static async AcceptApplication(appId,status) {
        const query = 'UPDATE doctor_applicartions set status = ? where id = ?';
        const [rows] = await db.query(query, [status,appId]);
        return rows; // Return the first user found with the given email
      }
      static async getApplicationsByApplicantId(userId) {
        const query = 'SELECT * from doctor_applicartions where applicant = ?'; // Fixed typo in table name
        const [result] = await db.query(query,[userId]); // Removed unnecessary parameters
        return result;
      }
      static async getApplicationById(userId) {
        const query = 'SELECT * from doctor_applicartions where id = ?'; // Fixed typo in table name
        const [result] = await db.query(query,[userId]); // Removed unnecessary parameters
        return result;
      }
}
module.exports = DoctorApplication;
