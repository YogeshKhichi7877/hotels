const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

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
//************************************************************************************************ */

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

app.use(passport.initialize()); // starting the service .

app.get('/a' , passport.authenticate('local' , {session: false}), (req , res)=>{
    res.send("Authentication message ");
})

app.get('/' , (req , res)=>{
    res.send("welcome to my hotel ");
})

app.get('/menu' , (req , res)=>{
    //console.log("menu is not available right now ");
    res.send("menu is not available right now ");
})

app.post('/person' , async (req ,res)=>{
   try{
    const data = req.body ;
    const newPerson = new Person(data);

    const savedPerson = await newPerson.save();
    console.log('data saved ');
    res.status(200).json(savedPerson);

   }
   catch(err){
    console.log(err);
    res.status(500).json({error : 'internal server error'})

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
//new comment added to use git pull request.
//comment added for testing purpose .
const port = process.env.PORT || 5000 ; //this is not working 
app.listen(5000 , ()=>{
    console.log("listening on port 5000");
    console.log("http://localhost:5000");
})
