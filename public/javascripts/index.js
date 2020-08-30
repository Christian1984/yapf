//const { response } = require("express");

(function()
{
    console.log("index.js loaded!");

    const a = document.querySelector("a.send");
    const loadingSpan = document.querySelector("span.loading");
    const doneSpan = document.querySelector("span.done");
    const resultDiv = document.querySelector("#resultDiv");

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

    function populatePage(responseHtml)
    {
        console.log(resultDiv);
        if(!resultDiv) return;
        resultDiv.innerHTML = responseHtml;
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

                        populatePage(responseHtml);

                        uiUpdateOnRequestFinished();
                    }
                };
                xhttp.open("GET", "/planes", true);
                xhttp.send();
            }
        );
    }
})();