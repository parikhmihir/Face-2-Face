var express = require('express');
var app = express();
var path = require('path');
var bodyParser=require("body-parser");
var urlencodedParser=bodyParser.urlencoded({extended:false});
//your routes here

app.get('/', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/event.html', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'event.html'));
});

app.get('/meeting.html', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'meeting.html'));
});

app.get('/login.html', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.get('/signup.html', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'signup.html'));
});

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var request = require("request");
var auth_url = "https://auth.barely81.hasura-app.io";
var data_url = "https://data.barely81.hasura-app.io/v1/query";
/**
 * For deleting user from hasura auth table
 * @param {number} user_id - Hasura id
 * @param {string} password - User password required to confirm delete
 * @param {string} auth_token - Authorization token
 */
function deleteUser(user_id, password, auth_token) {
  var options = {
    method: 'POST',
    url: auth_url + '/user/account/delete',
    headers: {
      'Authorization': 'Bearer ' + auth_token,
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: {
      hasura_id: user_id,
      password: password
    },
    json: true
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    //console.log(response.body);
  });
}
app.post("/signup", urlencodedParser, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var gender = req.body.gender;
  var addr_building = req.body.addr_building;
  var addr_street = req.body.addr_street;
  var addr_city = req.body.addr_city;
  var addr_state = req.body.addr_state;
  var occupation = req.body.occupation;
  var hobby = req.body.hobby;
  if (username.trim() === "" || password.trim() === "" || fname.trim() === "" || lname.trim() === "" || gender.trim() === "" || addr_building.trim() === "" || addr_street.trim() === "" || addr_city.trim() === "" || addr_state.trim() === "" || occupation.trim() === "" || hobby.trim() === "") {
    res.send("Please fill all input fields!");
  } else {
    var options = {
      method: 'POST',
      url: auth_url + '/signup',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body: {
        username: username,
        password: password
      },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      //console.log(body);
      code = response.statusCode;
      var hasuraid = response.body.hasura_id;
      var auth_token = response.body.auth_token;
      if (code == 200) {
        var options = {
          method: 'POST',
          url: data_url,
          headers: {
            'Authorization': 'Bearer ' + auth_token,
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          },
          body: {
            type: 'insert',
            args: {
              table: 'user_info',
              objects: [{
                u_id: hasuraid,
                fname: fname,
                lname: lname,
                gender: gender,
                addr_building: addr_building,
                addr_street: addr_street,
                addr_city: addr_city,
                addr_state: addr_state,
                occupation: occupation,
                hobby: hobby,
                username: username,
                password: password
              }]
            }
          },
          json: true
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          code = response.statusCode;
          //res.json(body);
          if (code === 200) {
            res.send("Successfully registered");
          } else {
            // delete user on error
            deleteUser(hasuraid, password, auth_token);
            res.send("Error in registering!");
          }
        });
      } else if (code == 409) {
        res.send("username already exists");
      } else {
        res.send("some error occurred");
      }
    });
  }
});

app.post("/login",urlencodedParser,function(req,res){

  var username=req.body.username;
  var password=req.body.password;
  var temp;
  console.log(username);
  console.log(password);
    var req = new XMLHttpRequest();
    req.open('POST', 'https://auth.barely81.hasura-app.io/login', true);
     // force XMLHttpRequest2
    req.withCredentials=true;
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({username: username,password: password}));
     // pass along cookies
    req.onload = function()  {
        // store token and redirect
        try {
            temp = JSON.parse(req.responseText);
            code=req.status;
            console.log(temp);
            console.log(code);
            if(code==200){
              res.cookie('randomcookiename',temp, { maxAge: 345600000});
              console.log("Successfully logged in");
              res.redirect('/');
            }
            else {
            res.status(code).send(temp);
            }
        } catch (error) {
            return error;
        }
    };
});

app.post("/event",urlencodedParser,function(req,res){
  var e_name = req.body.e_name;
  var e_description = req.body.e_description;
  var e_place = req.body.e_place;
  var participaption_limit = req.body.participaption_limit;
  var age_group = req.body.age_group;
  var start_time = req.body.start_time;
  var duration = req.body.duration;
  var request = require("request");
  var options = {
    method: 'POST',
    url: 'https://data.barely81.hasura-app.io/v1/query',
    headers:
     {
       'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: 
    {
    	e_name: e_name,
    	e_description: e_description,
    	e_place: e_place,
    	participaption_limit: participaption_limit,
    	age_group: age_group,
    	start_time: start_time,
    	duration: duration
    },
    json: true };
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    code=response.statusCode;
    if(code === 200){
     token = body.auth_token;
     //console.log("token is "+token);

     var request1 = require("request");

     var options = { method: 'POST',
       url: 'https://data.barely81.hasura-app.io/v1/query',
       headers:
        {
          'cache-control': 'no-cache',
          'Authorization': 'Bearer '+token,
          'content-type': 'application/json' },
          body: {
            type: 'insert',
            args: {
              table: 'event_info',
              objects: [{
                e_name: e_name,
                e_description: e_description,
                e_place: e_place,
                participaption_limit: participaption_limit,
                age_group: age_group,
                start_time: start_time,
                duration: duration
              }]
            }
          },
          json: true
        };

     request1(options, function (error, response, body) {
       //if (error) throw new Error(error);

       console.log('body '+body);
       console.log("code "+response.status_code);
 })}
 else if(code == 409){
   res.send("Event not created");
 }
 else{
   res.send("some error occurred");
 }
});
});

app.get('/style.css', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/script.js', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'script.js'));
});

app.get('/validation.js', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'validation.js'));
});

app.get('/home.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home.jpg'));
});

app.get('/meeting.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'meeting.jpg'));
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
