const express=require("express");
const {check}=require("express-validator");
const {registerUser,loginUser}=require("../controllers/userController")
let userRouter=express.Router();

userRouter.post("/login",[
    check("email").notEmpty().isEmail(),
    check("password").notEmpty()
],loginUser);

userRouter.post("/register",[
    check("name").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty()
],registerUser);


module.exports=userRouter;