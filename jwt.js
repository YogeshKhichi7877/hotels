const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET ; 


const jwtAuthMiddleware = (req , res , next)=>{
    // first check request header has authorization or not 
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error : " invalid token "});
    //extract the jwt token from the request headers 

    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error : 'unauthourized'});
    }
    try{
        // verify the jwt token 
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        //attach user information to the request object 
        req.user = decoded ;
        next();

    }catch(err){
        console.log("error accured");
        res.status(401).json({error : 'invalid token'});

    }
}
// function to generate the token .
const generateToken = (userData) => {
    return jwt.sign({userData}, process.env.JWT_SECRET); // token expires in 1 hour
};


module.exports = {jwtAuthMiddleware , generateToken} ;