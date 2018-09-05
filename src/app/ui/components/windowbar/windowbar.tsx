// Node Modules
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";
import WindowbarItem from "ui/components/windowbar/windowbarItem"; 

export default class WindowBar extends UIComponent<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onMinimize():void
    {
        this.sendMainMessage(MessageChannel.windowMinimize);
    }

    private onMaximize():void
    {
        this.sendMainMessage(MessageChannel.windowMaximize);
    }

    private onClose():void
    {
        this.sendMainMessage(MessageChannel.windowClose);
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