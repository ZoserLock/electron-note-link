import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import WindowbarItem from "./windowbarItem"; 
import Message from "../../../core/message";

export default class WindowBar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onMinimize():void
    {
        ipcRenderer.send(Message.windowMinimize);
    }

    private onMaximize():void
    {
        ipcRenderer.send(Message.windowMaximize);
    }

    private onClose():void
    {
        ipcRenderer.send(Message.windowClose);
    }

    public render() 
    {
        return (
            <header className="ui-windowbar">
                <WindowbarItem type="options" onClick={()=>this.onClose()}/>
                <span className="ui-inline-spacer"></span>
                <WindowbarItem type="minimize" onClick={()=>this.onMinimize()}/>
                <WindowbarItem type="maximize" onClick={()=>this.onMaximize()}/>
                <WindowbarItem type="close" onClick={()=>this.onClose()}/>
            </header>
        );
    }

}