// import required packages
const express= require("express");
const https= require("https");
const bodyparser= require("body-parser");
  
const app= express();
app.use(express.static("public"));
  
app.use(bodyparser.urlencoded({extended:true}));
  
// On the home route, send signup html template
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
  
// Manage post request on home route and
// Send data to the MailChimp account via API 
app.post("/",function(req,res){
  const firstName=req.body.fname;
  const email=req.body.email;
  const lastName=req.body.lname;
  
  const data={
    members:[{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  
// Converting string data to JSON data
const jsonData= JSON.stringify(data);
const url="https://us21.api.mailchimp.com/3.0/lists/762956fb4c";
const options={
  method:"POST",
  auth:"harry:beab67d2eb05874f141966456f1c3036-us21"
}
  
// On success send users to success, otherwise on failure template 
const request=https.request(url,options,function(response){
  if(response.statusCode === 200) {
    res.sendFile(__dirname+"/success.html");
  } else {
    res.sendFile(__dirname+"/failure.html");
  }

  response.on("data",function(data){
    console.log(JSON.parse(data));
    console.log(response.statusCode);
  });
});
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 8000.");
})