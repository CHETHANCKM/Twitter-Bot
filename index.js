require('dotenv').config();
const http = require('https')
const express = require("express")
const app = express()
const twit = require('./twit');
var date,  total_confirmed, total_vacc, total_recovered;
const port= process.env.PORT || 3000;

setInterval(function(){  getinfo(); }, 60000);




function getinfo()
{

  var options = {
    host: 'api.covid19india.org',
    path: '/v4/data.json'
  };
  
  var req = http.get(options, function(res) {
    var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);

    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var jsonObj = JSON.parse(body)
      
      var total_confirmed = jsonObj.KA.total.confirmed;
      var total_recovered = jsonObj.KA.total.recovered;
      var total_dec= jsonObj.KA.total.deceased;
      var total_others= jsonObj.KA.total.other;
      var total_vacc= jsonObj.KA.total.vaccinated;
      var total_tested= jsonObj.KA.total.tested;
      twit.post('statuses/update', {
          status: 'As of the latest Official Bulletin, '+total_confirmed+' total cases have been confirmed. This includes '+total_recovered+' recovered cases and '+total_dec+' deceased cases.\n\nAs of now, '+total_vacc+' are been vaccinated and '+total_tested+' tests has been conducted.\n#COVID19India\n\nhttps://coronakarnataka.in'
          },  
          function(error, tweet, response) {
          if(error) 
            {
              console.log("Duplicate tweet");
            }
        else
          {
            console.log(tweet);  
            console.log(response); 
          }
           
        });

    })
  });
  
}





function tenminloop()
{
  
}

app.listen(port, ()=>{
  console.log(`Server is running at ${port}`);
});

