import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import WindowbarItem from "./windowbarItem"; 
import MessageChannel from "presenter/messageChannel";

export default class WindowBar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onMinimize():void
    {
        ipcRenderer.send(MessageChannel.windowMinimize);
    }

    private onMaximize():void
    {
        ipcRenderer.send(MessageChannel.windowMaximize);
    }

    private onClose():void
    {
        ipcRenderer.send(MessageChannel.windowClose);
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