//const { response } = require("express");

(function()
{
    console.log("index.js loaded!");

    const a = document.querySelector("a.send");
    const loadingSpan = document.querySelector("span.loading");
    const doneSpan = document.querySelector("span.done");
    const resultTable = document.querySelector("table#results>tbody");

    function uiUpdateOnRequestStarted()
    {
        if (a) a.hidden = true;
        if (loadingSpan) loadingSpan.hidden = false;
        if (doneSpan) doneSpan.hidden = true;
    }

    function uiUpdateOnRequestFinished()
    {
        if (a) a.hidden = false;
        if (loadingSpan) loadingSpan.hidden = true;
        if (doneSpan) doneSpan.hidden = false;
    }

    function populateTable(planesData)
    {
        if(!resultTable) return;
        
        // clear table
        // TODO

        for (plane of planesData)
        {
            let trPlane = document.createElement("tr");
            
            let tdMakeModel = document.createElement("td");
            tdMakeModel.textContent = plane.MakeModel;
            trPlane.append(tdMakeModel);

            let tdRegistration = document.createElement("td");
            tdRegistration.textContent = plane.Registration;
            trPlane.append(tdRegistration);

            let tdLocation = document.createElement("td");
            tdLocation.textContent = plane.Location;
            trPlane.append(tdLocation);

            let tdEquipment = document.createElement("td");
            tdEquipment.textContent = plane.Equipment;
            trPlane.append(tdEquipment);

            let tdTimeLast100hr = document.createElement("td");
            tdTimeLast100hr.textContent = plane.TimeLast100hr;
            trPlane.append(tdTimeLast100hr);

            resultTable.append(trPlane);
        }
    }


    if(a) 
    {
        a.addEventListener("click", (e) => 
            {
                e.preventDefault();
                console.log("a clicked!");

                uiUpdateOnRequestStarted();

                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) 
                    {
                        console.log(this);

                        responseJson = JSON.parse(this.response);
                        console.log(responseJson);

                        populateTable(responseJson.planes);

                        uiUpdateOnRequestFinished();
                    }
                };
                xhttp.open("GET", "/planes", true);
                xhttp.send();
            }
        );
    }
})();