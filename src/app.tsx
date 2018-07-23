// Node Imports
import {ipcRenderer} from "electron"; 
import * as React from "react"
import * as ReactDOM from "react-dom"

// Local Imports
import ApplicationWindow from "./app/ui/components/applicationWindow";
import Message from "./app/core/message";


function loadCss(css:string, callback:Function):void
{
    var s = document.createElement('link');
    s.rel="stylesheet";
    s.type = "text/css";
    s.href = css;
    s.addEventListener('load', function (e) 
    { 
        callback();
    }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
}

loadCss("../css/app.css",()=>
{
    setTimeout(()=>
    {
        ipcRenderer.send(Message.windowLoaded);
    },500);
});

// Render the actual application
ReactDOM.render(<ApplicationWindow/>,document.getElementById("root"));

