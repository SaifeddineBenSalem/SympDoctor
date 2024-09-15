const db = require('../db');

class Feedback {
static async create(feedback_text, poster, posting_date,stars) {
    const query = 'INSERT INTO feedback (feedback_text, poster, posting_date,stars) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [feedback_text, poster, posting_date,stars]);
    return result.insertId; 
  }
  static async findByPosterIdAndStatus(id,status) {
    const query = 'SELECT * FROM feedback WHERE poster = ? and status =?';
    const [result] = await db.query(query, [id,status]);
    return result; // Return the ID of the newly created user
  }
  static async findByPosterId(id) {
    const query = 'SELECT * FROM feedback WHERE poster = ?';
    const [result] = await db.query(query, [id]);
    return result; // Return the ID of the newly created user
  }
  static async AcceptFeedback(appId,status,handler,handling_time) {
    const query = 'UPDATE feedback set status = ? , handler = ? , handling_date = ? where id = ?';
    const [rows] = await db.query(query, [status,handler,handling_time,appId]);
    return rows; // Return the first user found with the given email
  }
  static async DeclineFeedback(appId,status,handler,handling_time,reason) {
    const query = 'UPDATE feedback set status = ? , handler = ? , handling_date = ? , reason=? where id = ?';
    const [rows] = await db.query(query, [status,handler,handling_time,reason,appId]);
    return rows; // Return the first user found with the given email
  }
  static async findByFeedbackId(id) {
    const query = 'SELECT * FROM feedback WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result; // Return the ID of the newly created user
  }
  static async getAllFeedbacks() {
    const query = 'SELECT * from feedback'; // Fixed typo in table name
    const [result] = await db.query(query); // Removed unnecessary parameters
    return result;
  }
  static async getAllApplications() {
    const query = 'SELECT * from feedback where status = ?'; // Fixed typo in table name
    const [result] = await db.query(query,['Accepted']); // Removed unnecessary parameters
    return result;
  }
}
module.exports = Feedback;
