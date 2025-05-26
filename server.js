const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Person = require('./models/person');

app.get('/' , (req , res)=>{
    res.send("welcome to my hotel ");
})

app.get('/menu' , (req , res)=>{
    console.log("menu is not available right now ");
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
         const workType = req.params.worktype ; // extract the work type from the URL parameter .

    if(workType =='chef' , workType=='waiter' , workType == 'manager'){
        const response = await Person.find({work : workType});
        console.log('response fetched ');
        res.status(200).json(response);

    }else {
        res.status(404).json({error: err.message}) 
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
app.listen(5000 , ()=>{
    console.log("listening on port 5000");
    console.log("http://localhost:5000");
})
