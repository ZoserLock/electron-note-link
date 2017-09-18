// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Notebook from "../../../notes/Notebook";

// UI
import UIManager from "../../uiManager"

interface NotebookItemData
{
    notebook:Notebook;
}

export default class NotebookItem extends React.Component<NotebookItemData, NotebookItemData> 
{
    constructor(props: any)
    {
        super(props);
    }

    public shouldComponentUpdate(nextProps:NotebookItemData, nextState:NotebookItemData):boolean
    {
        if(nextProps.notebook.name != this.props.notebook.name)
        {
            return true;
        }

        if(nextProps.notebook.isSelected != this.props.notebook.isSelected)
        {
            return true;
        }

        return false;
    }

    private onItemClick()
    {
        let data =
        {
            notebookId:this.props.notebook.id
        }
        UIManager.instance.sendMessage("action:SelectNotebook",data);
    }

    public render() 
    {
        let displayClass = (this.props.notebook.isSelected)? "selected text-unselect": "text-unselect";
        return (
            <li className={displayClass} onClick={()=>this.onItemClick()}>
                <span>{this.props.notebook.name}</span> 
            </li>
        );
    }

}