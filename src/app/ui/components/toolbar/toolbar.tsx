import * as React from "react";
import {ipcRenderer} from "electron"; 

// UI
import ToolbarItem from "./toolbarItem"; 
import SearchBar from "./searchBar"; 

export default class Toolbar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        
    }

    private createNewNote():void
    {
        ipcRenderer.send("action:NewNote");
    }

    private createNewNotebookStorage():void
    {
        ipcRenderer.send("action:NewNotebookStorage");
    }

    private doTest():void
    {
        ipcRenderer.send("action:DoTest");
    }

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <ToolbarItem name="New Note" onClick={()=>this.createNewNote()}/>
                <ToolbarItem name="Add Storage" onClick={()=>this.createNewNotebookStorage()}/>
                <ToolbarItem name="Test" onClick={()=>this.doTest()}/>
                <SearchBar/>
            </header>
        );
    }

}