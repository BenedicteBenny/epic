import db from '../db';

class MessageService {
    async create(message) {
        try {
            const values = Object.values(message);
            const res = await db.query(`INSERT INTO messages(parent_message_id, subject, message) VALUES($1, $2, $3) RETURNING *`,values);    
            return res && res.rows[0]
        } catch (error) {
            throw error;  
        }
    }
}

export default new MessageService();