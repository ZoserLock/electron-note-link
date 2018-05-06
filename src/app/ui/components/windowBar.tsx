import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import ToolbarItem from "./toolbarItem"; 
import Message from "../../core/message";

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
                <ToolbarItem name="Close" onClick={()=>this.onClose()}/>
                <ToolbarItem name="Maximize" onClick={()=>this.onMaximize()}/>
                <ToolbarItem name="Minimize" onClick={()=>this.onMinimize()}/>
            </header>
        );
    }

}