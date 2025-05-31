const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const {jwtAuthMiddleware , generateToken} = require('./jwt');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy ;// username and passport strategy .

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Person = require('./models/person');

//************************************************************************************************ */
// Middleware function .
const logRequest = (req , res , next)=>{
    console.log(`${new Date().toLocaleString()} Request made to : ${req.originalUrl}`);
    next();// agar koi dusra logrequest hai toh usko pura karenga warna server ke pass jayega ..
}

app.use(logRequest);//timing added to every get , post , put , etc  request .
//************************************************************************************************* */

//Authentication .
passport.use(new localStrategy(async (USERNAME , password , done)=>{
    //authentication logic 
    try{

        //console.log("received credentials ", USERNAME , password  );
        const user = await Person.findOne({username : USERNAME});
        if(!user){
            return done(null , false ,{message:'incorrect username'});
        }
        const isPasswordMatch = user.password == password ? true : false ;
        if(isPasswordMatch){
            return console.log(null , user);
        }else {
            return done(null , false , {message : 'Incorrect password'});
        }

    }catch(err){
        return done(err);
    }
}))

const localAuthMiddleWare = passport.authenticate('local' , {session: false});

app.use(passport.initialize()); // starting the service .

app.get('/a' , localAuthMiddleWare ,(req , res)=>{
    res.send("Authentication message ");
})

app.get('/' , (req , res)=>{
    res.send("welcome to my hotel ");
})

app.get('/menu' , (req , res)=>{
    //console.log("menu is not available right now ");
    res.send("menu is not available right now ");
})

app.post('/person/signup' , async (req ,res)=>{
   try{
    const data = req.body ;
    const newPerson = new Person(data);

    const response = await newPerson.save();
    console.log('data saved ');
    const payload ={
        id : response.id,
        username : response.username ,
    }
    console.log(JSON.stringify(payload));

    const token = generateToken(response.username);
    console.log("token is : " , token);
    res.status(200).json({ response : response , token : token});

   }
   catch(err){
    console.log(err);
    res.status(500).json({error : err.message})

   }

})


app.post('/person/login' , async (req , res)=>{
    try {
        // extract the username and password 
        const {username , password} = req.body ;

        // find the user by username 
        const user = await Person.findOne({username : username});

        // if user does not exist 
        // condition is false always (fix this ) 
        // if( !user && !(await user.comparePassword(password))){
        //     return res.status(401).json({error : 'invalid username or password'})
        // }

        // generate token 
        const payload ={
            id : user.id ,
            username : user.username 
        }
        const token = generateToken(payload) ; 
        // return token as response 
        res.json(token);
        

    }catch(err){
        console.log(err);
        res.status(500).json({error : err.message });

    }
})
//to get the saved data from the data base 

app.get('/person', async (req ,res)=>{
    try {
        const data = await Person.find();
        console.log('data fetched  ');
         res.status(200).json(data);
    }catch(err){ 
        console.log(err);
    }

})
app.get('/person/:workType' ,async (req , res)=>{ ///:worktype becomes a variable .
    try{
         const workType = req.params.workType ; // extract the work type from the URL parameter .

    if(workType =='chef' || workType=='waiter' || workType == 'manager'){
        const response = await Person.find({work : workType});
        console.log('response fetched ');
        res.status(200).json(response);

    }else {
        res.status(404).json({error:"error occured"}) 
    }

    }catch(err){
        console.log('Error accured ' , err);
        res.status(500).json({error: err.message}) 
    }
   
})

//updating data .
app.put('/person/:id' , async (req ,res)=>{
    try{
        const personid = req.params.id; //extract the persons id from the url parameter 

        const updatepersonsdata = req.body ; //updated data for the person 

        //assuming you have a person model 
         //updatepersonsdata hame update karna hai jiski id hai personid .
       const response = await Person.findByIdAndUpdate(personid, updatepersonsdata, {
  new: true,
  runValidators: true
});

        if(!response){
            res.status(404).json('id not found ');
        }
        console.log("data updated ");
        res.status(200).json(response);
       
    
    }catch(err){
        console.log("error occured"  , err);
        res.status(500).json(err.message);

    }
})
app.delete('/person/:id' , async (req , res)=>{
    try{
         const personid = req.params.id;
          const response = await Person.findByIdAndDelete(personid);
          if(!response){
            res.status(404).json('id not found ');
        }
        console.log("data deleted");
        res.status(200).json({message : 'data has been deleted'});

    }catch(err){
        console.log("error occured"  , err);
        res.status(500).json(err.message);

    }
})
// profile viewver
app.get('/profile' , jwtAuthMiddleware,async (req , res)=>{
    try{ 
    
    const profile = req.user ;
    console.log("User data :" , profile);

    const userId = profile._id ;
    const user = await Person.findById(userId);

    res.status(200).json(user);
 
}catch(err){
    console.log("error occured"  , err);
    res.status(500).json(err.message);
}
})

//new comment added to use git pull request.
//comment added for testing purpose .
const port = process.env.PORT || 5000 ; //this is not working 
app.listen(5000 , ()=>{
    console.log("listening on port 5000");
    console.log("http://localhost:5000");
})

//bcrypt use karne ka demo code .(from original website) :
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'yogesh';
const someOtherPlaintextPassword = 'not_me';//ye kuch bhi ho sakta hai . 

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash); // hash will contain the password in a string formate .

        bcrypt.compare("yogesh" , 'wertyuiophgtrfdesdfghuiolkijuytredfgh' , (err , res)=>{
            console.log(res) ; // true or false 
        })
    });
});

