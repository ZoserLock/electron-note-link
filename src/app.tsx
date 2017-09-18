// Node Imports
import * as React from "react"
import * as ReactDOM from "react-dom"

import {ipcRenderer} from "electron"; 

// Local Imports
import ApplicationWindow from "./app/ui/components/applicationWindow";
import UIManager from "./app/ui/uiManager";

// Initialize the UIManager before render the application
UIManager.initialize();

// Render the actual application
ReactDOM.render(
    <ApplicationWindow/>
    ,document.getElementById("root")
);