const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserRepository = require("../../repositories/userrepository");
const env = process.env;

module.exports = async(req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const { authorization } = req.headers;
    if (authorization===null || authorization=== undefined) {

      throw {status:400, message:"Not-Login"}
    }
    const [tokenType, tokenValue] = (authorization||"").split(" ");
    if (tokenType !== "Bearer") return res.send("Not-Exist-Token");
    
      const userInfo = jwt.verify(tokenValue, env.SECRETKEY);

      if(!userInfo.userId){
        throw { status:400, message:"Wrong-Approach"}
      }
      const usercheck = await userRepository.usercheck(userInfo.id);
      
      if(!usercheck){
        throw {status:400, message:"Not-Exist-User"}
      }else{
        res.locals.userId = userInfo.id;
      }
    } catch (err) {
      next(err)
    }
    next();
};