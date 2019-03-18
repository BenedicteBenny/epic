import db from '../db';


class UserModel {
    async create(user) {
        try {
            const values = Object.values(user);
            const res = await db.query(`INSERT INTO users(firstname, lastname, username, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *`,values);    
            return res && res.rows[0]
        } catch (error) {
            throw error;  
        }
    }

    async readOne(condition, values) {
        try {
            const res  = await db.query(`SELECT * FROM users WHERE ${condition}`, values);
            return res && res.rows[0];
        } catch (error) {
            throw error;
        }
    }

    readMany() {

    }
    update() {

    }
    delete() {

    }
}

export default new UserModel;