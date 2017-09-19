import { ipcRenderer } from "electron";
import * as React from "react";

import LeftPanel from "./leftPanel";
import NoteList from "./noteList";
import RightViewport from "./rightViewport";
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
        return(
            <div className="ui-window">
                <Toolbar/>
                <div className="ui-main">
                    <LeftPanel/>
                    <NoteList/>
                    <RightViewport/>
                </div>
                <StatusBar/>
            </div>
        );
    }
}