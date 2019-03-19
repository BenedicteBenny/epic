import jwt from 'jsonwebtoken';

if(process.env.NODE_ENV !== "development") {
    require("dotenv").config();
}

const JWTPRIVATEKEY = process.env.JWTPRIVATEKEY;

function verifyToken(token) {
    return jwt.verify(token, JWTPRIVATEKEY);
}

export function isUserAuthenticated(req, res, next) {
    const token = req.get('x-auth-token');
    
    if(!token) {
        return res.status(400).send({
            status: 400,
            message:"Invalid token"
        })
    }else {
        try { // jwt.verify might throw error
            const decoded = verifyToken(token);
            req.user = {
                id: decoded.id
            };
            next();
        }catch( error ) {
            return res.status(400).send({
                status: 400,
                message: "User should be authenticated to perform this action"
            })
        }
    }
};
