// Node Imports
import * as React from "react"
import * as ReactDOM from "react-dom"

import {ipcRenderer} from "electron"; 

// Local Imports
import ApplicationWindow from "./app/ui/components/applicationWindow";

// Render the actual application
ReactDOM.render(<ApplicationWindow/>,document.getElementById("root"));