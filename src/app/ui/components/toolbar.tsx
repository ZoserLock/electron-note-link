import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import UIManager from "../uiManager"
import ToolbarItem from "./toolbarItem"; 

export default class Toolbar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private createNewNote():void
    {
        UIManager.instance.sendMessage("action:NewNote");
    }

    private createNewNotebookStorage():void
    {
        UIManager.instance.sendMessage("action:NewNotebookStorage");
    }

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <ToolbarItem name="New Note" onClick={()=>this.createNewNote()}/>
                <ToolbarItem name="New Storage" onClick={()=>this.createNewNotebookStorage()}/>
                <ToolbarItem/>
            </header>
        );
    }

}