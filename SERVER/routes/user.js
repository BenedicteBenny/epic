import { Router } from "express";
import users from "../controllers/usercontroller";



const userRouter=Router();

 userRouter.post('/auth/signup',users.signup);
userRouter.post('/auth/login',users.login);
// userRouter.get('/users',users.getAllUsers);

export default userRouter;