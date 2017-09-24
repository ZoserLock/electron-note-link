import { ipcRenderer } from "electron";
import * as React from "react";

import Debug from "../../tools/debug"

import LeftPanel from "./leftPanel";
import NoteList from "./noteList";
import NoteView from "./noteView";
import StatusBar from "./statusBar";
import Toolbar from "./toolbar";

export default class ApplicationWindow extends React.Component<any, any> 
{
    constructor()
    {
        super();

        this.state = 
        {
            name:"Zoser Default",
            toolbar:null,
        };

        ipcRenderer.on("data",(event:any,data:any)=>this.dataReceived(event,data));
    }

    public dataReceived(event:any,data:any):void
    {
        console.log(data.name);

        this.setState({name:data.name});
    }

    
    render() 
    {
        Debug.log("Render Application window");
        return(
            <div className="ui-window">
                <Toolbar/>
                <div className="ui-main">
                    <LeftPanel/>
                    <NoteList/>
                    <NoteView/>
                </div>
                <StatusBar/>
            </div>
        );
    }
}