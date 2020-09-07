let AirportData = require("./utils/airportdata");

const https = require("https");
const xml2js = require("xml2js");
const express = require('express');
const router = express.Router();


function getJobs(url, readaccesskey, icaos, res)
{
    const dashSeparatedIcaoString = icaos.map(e => e.trim()).join("-");
    console.log("Requesting jobs for: " + dashSeparatedIcaoString);
    //https://server.fseconomy.net/data?userkey=2E87E63F0552DF38&format=xml&query=icao&search=jobsfrom&icaos=CZFA-CEX4-CYMA
    
    const path = `/data?userkey=${readaccesskey}&format=xml&query=icao&search=jobsfrom&icaos=${encodeURIComponent(dashSeparatedIcaoString)}`;
    //console.log(path);

    let responseJson = { 
        errs: [],
        msgs: [],
        jobs: {}
    };

    var options = {
        host: url,
        path: path,
        method: "GET",
        headers: { }
    };

    var httpsreq = https.request(options, (response) => 
        {
            let responseXml = "";
            response.setEncoding("utf8");
            response.on("data", function (chunk)
                {
                    responseXml += chunk;
                }
            );
            response.on("end", function() 
                {
                    try 
                    {
                        xml2js.parseString(responseXml, (err, result) => 
                            {
                                if (err)
                                {
                                    console.log(err);
                                    responseJson.errs.push(err);
                                }
                                else
                                {
                                    responseJson.msgs.push(`Received job data for ${dashSeparatedIcaoString}`);
                                    console.log(result);
                                    responseJson.jobs = result;
                                    //TODO

                                    res.json(responseJson);
                                }
                            }
                        );
                    }
                    catch (e)
                    {
                        console.log(e);
                        responseJson.errs.push(e);
                    }
                }
            );
        }
    );
    
    httpsreq.on("error", (e) => 
        {
            console.log(e);
            responseJson.errs.push(e);
        }
    );

    httpsreq.end();
}

/* POST jobs. */
router.post('/', function(req, res, next) 
{

    const url = "server.fseconomy.net";

    //let readaccesskey = postData.readaccesskey ? postData.readaccesskey.trim() : ""; //2E87E63F0552DF38
    let readaccesskey = "2E87E63F0552DF38";

    let icaos = ["EDDK", "EDDM"];

    getJobs(url, readaccesskey, icaos, res);
});

module.exports = router;
