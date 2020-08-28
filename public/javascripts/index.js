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

    function populateTable(planesHtml)
    {
        if(!resultTable) return;
        resultTable.innerHTML = planesHtml;
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

                        responseHtml = this.response;
                        console.log(responseHtml);

                        populateTable(responseHtml);

                        uiUpdateOnRequestFinished();
                    }
                };
                xhttp.open("GET", "/planes", true);
                xhttp.send();
            }
        );
    }
})();