(function()
{
    console.log("index.js loaded!");
    const a = document.querySelector("a");
    const loadingSpan = document.querySelector("span.loading");
    const doneSpan = document.querySelector("span.done");

    if(a) 
    {
        a.addEventListener("click", (e) => 
            {
                e.preventDefault();
                console.log("a clicked!");

                if (loadingSpan) loadingSpan.hidden = false;

                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) 
                    {
                        console.log(this);
                        if (loadingSpan) loadingSpan.hidden = true;
                        if (doneSpan) doneSpan.hidden = false;
                    }
                };
                xhttp.open("GET", "/planes", true);
                xhttp.send();
            }
        );
    }
})();