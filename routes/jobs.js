let AirportData = require("./utils/airportdata");

const https = require("https");
const xml2js = require("xml2js");
const express = require('express');
const router = express.Router();

const url = "server.fseconomy.net";


function getJobs(url, readaccesskey, icaos, res, callback)
{
    console.log("Requesting jobs for: " + icaos);
    const path = `/data?userkey=${readaccesskey}&format=xml&query=icao&search=jobsfrom&icaos=${encodeURIComponent(icaos)}`;

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
                                    responseJson.msgs.push(`Received job data for ${icaos}`);
                                    //console.log(result);

                                    let jobs = [];

                                    if (result.IcaoJobsFrom) {
                                        if (result.IcaoJobsFrom.Assignment) {
                                            const icaosList = result.IcaoJobsFrom.Assignment.map(el => el.FromIcao[0]);
                                            const icaosSet = Array.from(new Set(icaosList));
                                            const initial = icaosSet.reduce((acc,el) => ({...acc, [el]: 0}), {});
                                            const jobsFromIcaos = icaosList.reduce((acc, el) => ({...acc, [el]: acc[el] + 1}), initial);
                                            jobs = jobsFromIcaos
                                        }
    
                                        responseJson.jobs = jobs;
                                    }
                                }

                                callback(res, responseJson)
                            }
                        );
                    }
                    catch (e)
                    {
                        console.log(e);
                        responseJson.errs.push(e);

                        callback(res, responseJson)
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
    //let readaccesskey = postData.readaccesskey ? postData.readaccesskey.trim() : ""; //2E87E63F0552DF38
    let readaccesskey = "2E87E63F0552DF38";
    let icaos = "EDDM-EDDK";

    getJobs(url, readaccesskey, icaos, res, (res, json) => {
        //TODO
        res.json(json);
    });
});

/* GET jobs. */
router.get('/', function(req, res, next) {
    let readaccesskey = "2E87E63F0552DF38";
    const icaos = "EDDM-EDDK";

    getJobs(url, readaccesskey, icaos, res, (res, json) => {
        const jobs = json.jobs;

        const data = {
            /*icaos: {
                "EDDM": 3,
                "EDDK": 2
            },*/
            icaos: jobs,
            json: json
        };
    
        res.render('jobs', data);
    });

});

module.exports = router;
