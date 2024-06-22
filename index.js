const http = require("http");
const fs = require("fs");
var requests = require("requests");

const  homefile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal,orgVal) =>
{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace(" {%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace(" {%temperaturestatus%}",orgVal.weather[0].main);

   
    return temperature;
}
const server = http.createServer((req, res) =>{
  
    if (req.url =="/")
     {
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=c37d5d9dec17aa92c0a0e095c072627f")

        .on("data",(chunk) =>{
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata]
        // console.log(arrdata[0].main.temp);
        const realtimedata = arrdata
        .map((val)=> replaceVal(homefile,val) )
        .join("");
           res.write(realtimedata);
        

        })
        .on("end",  (err)=>{
            if(err) return console.log("connection closed",err);

            res.end();
        
        });
    }
});

server.listen(3000,"127.0.0.1");