import db from '../db'; 

class UserMessageService {
    async create(userMessage) {
        try {
            const values = Object.values(userMessage);
            const res = await db.query(`INSERT INTO user_message(user_id, status, message_id) VALUES($1, $2, $3) RETURNING *`,values);    
            return res && res.rows[0]
        } catch (error) {
            throw error;  
        }
    }
}

export default new UserMessageService();