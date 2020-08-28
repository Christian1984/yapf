const express = require("express");
const router = express.Router();
const https = require("https");

class CountdownLatch
{
    constructor(counter, onCompletion, response, responseJson)
    {
        this.Counter = counter;
        this.OnCompletion = onCompletion;
        this.Response = response;
        this.ResponseJson = responseJson;
    }

    Signal()
    {
        this.Counter--;

        if (this.Counter <= 0) 
        {
            this.OnCompletion(this.Response, this.ResponseJson);
        }
    }
}

function sendResponse(res, responseJson)
{
    console.log(responseJson);
    res.json({title: "planes retrieved successfully!"});
}

function getPlanes(url, planeMakeModel, icaos, cdl, responseJson)
{
    const path = `/data?userkey=2E87E63F0552DF38&format=json&query=aircraft&search=makemodel&makemodel=${encodeURIComponent(planeMakeModel)}`;
    
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
                    console.log("responseXml: " + responseXml.substr(0, 255));
                    responseJson.planes.push(`Received data for ${planeMakeModel}`);
                    cdl.Signal();
                }
            );
        }
    );

    httpsreq.end();
}

/* GET planes */
router.get("/", function(req, res, next)
    {
        const url = "server.fseconomy.net";
        let icaos = ["EDDM", "EDDK"];
        //let planesMakeModel = ["Cessna 172 Skyhawk"];
        //let planesMakeModel = ["Diamond DA20 Katana"];
        //let planesMakeModel = ["Cessna 172 Skyhawk", "Diamond DA20 Katana"];
        let planesMakeModel = ["Cessna Citation II", "Columbia 400"];
        
        let responseJson = { planes: [] };

        const cdl = new CountdownLatch(planesMakeModel.length, sendResponse, res, responseJson);

        for (const pmm of planesMakeModel)
        {
            getPlanes(url, pmm, icaos, cdl, responseJson);
        }
    }
);

module.exports = router;
