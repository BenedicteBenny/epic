import users from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validateNewUser from '../Helper/validation'


export default class User{
    static getAllUsers(req,res){
        res.send(users);
    }

    static async userSignup(req,res){

        let usere= users.find(item => item.username === req.body.username);
        if(usere)
         {
            return res.status(400).send({
                status: 400,
                message:"Users already exists"
            });
    
         }
        let user ={
            id: users.length+1,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }       

        const { error }= validateNewUser.validateReistration(req.body)
        if( error ){
            res.status(400).send(error.details[0].message)
            return;
        }


        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(user.password,salt);
        
        const token= jwt.sign({id: user.id},process.env.JWTPRIVATEKEY)

        users.push(user);

        res.status(200).send({
            status: 200,
            message:"User registered successfully",
            data:[{
                'token':token
            }]
            
        })
    }
    static async userLogin(req,res){

        const { error }= validateNewUser.validateLogin(req.body)
        if( error ){
            res.status(400).send(error.details[0].message)
           return;
        }

        let user= users.find(item=>item.username === req.body.username);
        if(!user) return res.status(400).send({
            status: 400,
            message:"Invalid username or password"
        })

        user={
            username: req.body.username,
            password: req.body.password
        }

        const validPassword= bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send({
            status: 400,
            message:"Invalid username or password"
        })

        const token= jwt.sign({id: user.id},process.env.JWTPRIVATEKEY)
        res.status(200).send({
            status: 200,
            message: "User signed in successfully",
            data:[{
                'token':token
            }]
        })
    }

}

