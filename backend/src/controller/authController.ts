import User from "../models/User.js";
import userController from "./userController.js";

const signup = async(user :User)=>{
    try{
        const newUser = await userController.createUser(user);
    } catch (error) {
        throw new Error('Error creating user');
    }
}