// Node Imports
import {ipcRenderer} from "electron"; 
import * as React from "react"
import * as ReactDOM from "react-dom"

// Local Imports
import ApplicationWindow from "./app/ui/components/applicationWindow";
import Message from "./app/core/message";

// Render the actual application
ReactDOM.render(<ApplicationWindow/>,document.getElementById("root"));

ipcRenderer.send(Message.windowLoaded);