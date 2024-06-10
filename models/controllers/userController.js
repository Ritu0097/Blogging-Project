const bcrypt = require("bcrypt");
const base64 = require("base-64");
const Users = require("../users");


const signup = (req,res) =>{
    res.render('signup',{message:null})
}
const loginPage =(req, res) => {
    res.render("login",{ message: null });
  }
  const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const exitstingUser = await Users.findOne({ email });
      if (exitstingUser) {
        return res.render("signup",{ message: "User already exists please try to login"})
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({ name, email, password: hashPassword });
      newUser
        .save()
        .then((response) => {
          res.render("login", { message: "User created successfully" });
        })
        .catch((err) => {
            res.render("signup", {message: "User Cannot Be Created. Please try again later"});
        });
    } catch(err) {
        res.render("signup", {message: "User could not be created due to server issues"})
      }
  }
  const login = async (req, res) => {
    try{
        const {email,password} = req.body;
        const exitstingUser = await Users.findOne({ email });
        if (!exitstingUser) {
            return res.render("login",{ message: "User not registered with us. Please signup first."})
          }
          const passwordMatch=await bcrypt.compare(password,exitstingUser.password);
          if(passwordMatch){
            req.session.userId=exitstingUser._id;
            res.redirect('/')
          }
          else{
            res.render("login",{ message: "Invalid password"})
          }
    }
    catch(err) {
        res.render("signup", {message: "User could not be created due to server issues"})
    }
}
const allUsers =(req,res)=>{
  Users.find()
  .then(response=>{
    res.json(response)
  })
  .catch(error=>{
    res.json(error)
  })
}
const logout =(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login')
  })
}
module.exports ={
    signup,
    loginPage,
    register,
    login,
    allUsers,
    logout
}
