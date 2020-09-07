(function()
{
    const requestPlanesButton = document.querySelector("input#requestPlanes");
    const loadingSpan = document.querySelector("span.loading");
    const doneSpan = document.querySelector("span.done");
    const resultDiv = document.querySelector("#resultDiv");

    const readaccesskeyInput = document.querySelector("input#readaccesskey");
    const planemakemodelInput = document.querySelector("input#planemakemodel");
    const airportsicaoInput = document.querySelector("input#airportsicao");
    const rangeInput = document.querySelector("input#range");

    /*
    let storedReadaccesskey = window.localStorage.getItem("readaccesskey");
    if (storedReadaccesskey) readaccesskeyInput.value = storedReadaccesskey;

    if (readaccesskeyInput)
    {
        readaccesskeyInput.addEventListener("input", (e) => 
            {
                window.localStorage.setItem("readaccesskey", readaccesskeyInput.value);
            }
        );
    }
    */

    function populateFromStorage(element)
    {
        if (element)
        {
            let storedValue = window.localStorage.getItem(element.id);
            if (storedValue) element.value = storedValue;
        }
    }

    function initStorageListener(element)
    {
        if (element)
        {
            element.addEventListener("input", () => 
                {
                    window.localStorage.setItem(element.id, element.value);
                }
            );
        }
    }

    function uiUpdateOnRequestStarted()
    {
        if (requestPlanesButton) requestPlanesButton.disabled = true;
        if (loadingSpan) loadingSpan.hidden = false;
        if (doneSpan) doneSpan.hidden = true;
    }

    function uiUpdateOnRequestFinished()
    {
        if (requestPlanesButton) requestPlanesButton.disabled = false;
        if (loadingSpan) loadingSpan.hidden = true;
        if (doneSpan) doneSpan.hidden = false;
    }

    function populatePage(responseHtml)
    {
        console.log(resultDiv);
        if(!resultDiv) return;
        resultDiv.innerHTML = responseHtml;
    }

    function requestJobs(icaos)
    {
        const xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                console.log(this);
            }
        };

        let data = {
            icaos: icaos
        };

        xhttp.open("POST", "/jobs");
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(data));
    }

    populateFromStorage(readaccesskeyInput);
    populateFromStorage(planemakemodelInput);
    populateFromStorage(airportsicaoInput);
    populateFromStorage(rangeInput);
    
    initStorageListener(readaccesskeyInput);
    initStorageListener(planemakemodelInput);
    initStorageListener(airportsicaoInput);
    initStorageListener(rangeInput);

    if (requestPlanesButton) 
    {
        requestPlanesButton.addEventListener("click", (e) => 
            {
                e.preventDefault();
                console.log("#requestPlanes clicked!");

                uiUpdateOnRequestStarted();

                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() 
                {
                    if (this.readyState == 4 && this.status == 200) 
                    {
                        //console.log(this);
                        //console.log(this.response);
                        populatePage(this.response);
                        requestJobs(["EDDK"]);
                        uiUpdateOnRequestFinished();
                    }
                };

                let readaccesskey = readaccesskeyInput ? readaccesskeyInput.value : "";
                let planemakemodel = planemakemodelInput ? planemakemodelInput.value : "";
                let airportsicao = airportsicaoInput ? airportsicaoInput.value : "";
                let range = rangeInput ? rangeInput.value : "";

                let data = {
                    readaccesskey: readaccesskey,
                    planemakemodel: planemakemodel,
                    airportsicao: airportsicao,
                    range: range
                };

                xhttp.open("POST", "/planes");
                xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhttp.send(JSON.stringify(data));
            }
        );
    }
})();