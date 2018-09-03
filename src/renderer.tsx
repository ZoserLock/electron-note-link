// Node Imports
import {ipcRenderer, remote} from "electron"; 
import * as React from "react"
import * as ReactDOM from "react-dom"

const {Menu, MenuItem} = remote;

// Local Imports
import ApplicationWindow from "ui/components/applicationWindow";
import MessageChannel from "presenter/messageChannel";

// Create UI overlord

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
        ipcRenderer.send(MessageChannel.windowLoaded);
    },500);
});


let rightClickPosition:any = null;

const menu = new Menu();
const menuItem = new MenuItem({
        label: 'Inspect Element',
        click: () => 
        {
            remote.getCurrentWindow().webContents.inspectElement(rightClickPosition.x, rightClickPosition.y)
        }
    });
    
menu.append(menuItem);

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickPosition = {x: e.x, y: e.y}
    menu.popup({window: remote.getCurrentWindow()})
}, false)


// Render the actual application
ReactDOM.render(<ApplicationWindow/>,document.getElementById("root"));

