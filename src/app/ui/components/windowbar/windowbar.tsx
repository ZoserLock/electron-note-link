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
                <WindowbarItem name="" onClick={()=>this.onClose()}/>
                <span className="ui-inline-spacer"></span>
                <WindowbarItem name="" onClick={()=>this.onMinimize()}/>
                <WindowbarItem name="" onClick={()=>this.onMaximize()}/>
                <WindowbarItem name="" onClick={()=>this.onClose()}/>
            </header>
        );
    }

}