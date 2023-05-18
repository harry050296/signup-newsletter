//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const http = require("http");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res) => {

    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const mail = req.body.email;

    const data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "http://us21.api.mailchimp.com/3.0/lists/8839abe729";

    const options = {
        method: "POST",
        auth: "harry:3b5ae29d6d559886de2df4b393171e49-us21"
    }

    const request = http.request(url, options, function(response) {
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(3000, function() {
    console.log("Server Started");
});

//API Key
//3b5ae29d6d559886de2df4b393171e49-us21

//List ID
//8839abe729