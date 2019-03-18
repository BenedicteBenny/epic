import users from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Validator from '../helper/validation';
import UserModel from '../models/User';


export default class UserController {
    static getAllUsers(req,res){
        res.status(200).send({
          status: 200,
          message:"Users fetched successfully",
          data:{
            users
          }
        });
    }
    static async oldUserSignup(req,res){
        const { error } = Validator.validateReistration(req.body)
        if( error ){
            return res.status(400).send({
              status: 400,
              message: error.details[0].message
            });
        }

        let user = users.find(item => item.username === req.body.username);
        if(user)
         {
            return res.status(400).send({
                status: 400,
                message:"User already exists"
            });
    
         }

        user = {
            id: users.length+1,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }    

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        
        const token = jwt.sign({id: user.id},process.env.JWTPRIVATEKEY)

        users.push(user);

        return res.status(201).send({
            status: 201,
            message:"User registered successfully",
            data:[{
                'token':token
            }]
            
        });
    }
    static async oldUserLogin(req,res){

        const { error }= Validator.validateLogin(req.body)
        if( error ){
            res.status(400).send({
              status: 400,
              message: error.details[0].message
            })
           return;
        }

        let user= users.find(item=>item.username === req.body.username);
        
        if(!user) return res.status(404).send({
            status: 404,
            message:"Invalid username or password"
        })
        const validPassword= await  bcrypt.compare(req.body.password, user.password);
     
        if(!validPassword) return res.status(404).send({
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

    static async signup (req, res) {
        try {
            //valid req
            const isInvalid = Validator.createUser(req.body);
            if(isInvalid) {
                throw Object.assign({}, isInvalid);
            };
            // check if user exists
            const existingUser = await UserModel.readOne(`username = $1`, [req.body.username]);
            
            if(existingUser && existingUser.id) {
                throw "User already existed";
            }
            // encrypt password
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            //create new user
            const createdUser  = await UserModel.create(req.body);
            return res.status(201).send({
                status: 201,
                data: createdUser
            })

        } catch (error) {
            //consolidate all error into this exiting point
            return res.status(400).send({
                status: 400,
                message: error
            })   
        }

    }

    static async login(req, res) {
        try {
            // validate request
            const isInvalid = Validator.loginUser(req.body);
            if(isInvalid) {
                throw Object.assign({}, isInvalid);
            };
            // fetch user details 
            const user = await UserModel.readOne(`username = $1`, [req.body.username]);

            if(!user) {
                throw `User with username ${req.body.username} doesn't exist`
            }
            // compare password provide that user exist
            const validPassword = bcrypt.compareSync(req.body.password, user.password);
            // throw (terminate the req if user does not exist)
            if(!validPassword) {
                throw `Invalid password`;
            }
            // generate jwt token 
            const token= jwt.sign({id: user.id},process.env.JWTPRIVATEKEY)
            // respond
            return res.status(200).send({
                status: 200,
                message: "User signed in successfully",
                data:[{
                    'token':token
                }]
            });           
       } catch (error) {
           //consolidate all error into this exiting point
           return res.status(400).send({
                status: 400,
                message: error
            })   
       } 
    }
}

