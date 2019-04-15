var express = require('express');
var data = require('./data.json');
const fs = require('fs')
var app = express();
app.use(express.json());
app.get("/", function (request, response) {
 response.send('{"status":true}');
});
app.get("/",function(request,reponse){
	response.send("{'status':'running'}");
 });

app.post("/scores", function (request, response) {
 let scores = request.body.scores;
   if(!data.scores){
      data["scores"] = {}
   }
   for(let score of scores){
      if(!data["scores"][score.classId])
         data["scores"][score.classId] = {};
      if(!data["scores"][score.classId][score.studentId])
         data["scores"][score.classId][score.studentId] = {
            "name":score.name,
            "score":[]
         };
      data["scores"][score.classId][score.studentId]["score"].push({
         "score":score.score,
         "max":score.max,
         "timestamp":score.timeStamp
      })
   }
   console.log(data);
   fs.writeFile('./data.json', JSON.stringify(data), err => {
      if (err) {
            console.log('Error writing file', err)
      } else {
            console.log('Successfully wrote file')
      }   
   });
   response.send({"success":true}); 
});

app.post("/login", function (request, response) {
   let email = request.body.email;
   let password = request.body.password;
   console.log(data.users)
   if(!data.users){
      data["users"] = {}
   }
   if(!data.users[email]){
      response.json({"success":false,"err":"invalid username or password"});
      response.end();
   }
   if(data.users[email].password == password){
      let userDetails = {
         "email":email,
         "name":data.users[email].name,
         "classes":data.users[email].classes
      }
      
      response.json({"success":true,"data":userDetails});
   }
   else{
      response.json({"success":false,"err":"invalid username or password"});
   }
  });

app.post("/signup", function (request, response) {
   console.log(request.body)
   let email = request.body.email;
   let password = request.body.password;
   let name = request.body.name;
   let classes =request.body.classes;
   if(!data.users){
      data["users"] = {}
   }
   if(data.users[email])
      response.json({"success":false,"err":"This email is already registered"});
   else{
      data.users[email]={
         "name":name,
         "password":password,
         "classes":classes,
      }
      fs.writeFile('./data.json', JSON.stringify(data), err => {
         if (err) {
               console.log('Error writing file', err)
         } else {
               console.log('Successfully wrote file')
         }   
      });
      response.json({"success":true});
   }
});

var listener = app.listen(3000, function () {
   console.log('Your app is listening on port ' + listener.address().port);
});
