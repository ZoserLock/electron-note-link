// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Notebook from "../../../notes/notebook";
import Message from "../../../core/message";
import Editor from "../../../core/editor";

import { NoteListMode } from "../../../../enums";


interface NotebookItemData
{
    notebook:Notebook;
}

export default class NotebookItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public shouldComponentUpdate(nextProps:any, nextState:any):boolean
    {
        if(nextProps.notebook.name != this.props.notebook.name)
        {
            return true;
        }

        if(nextProps.isSelected != this.props.isSelected)
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
        
        ipcRenderer.send(Message.selectNotebook, data);
    }

    private onItemDelete()
    {
        let data =
        {
            notebookId:this.props.notebook.id
        }
        
        ipcRenderer.send(Message.removeNotebook, data);
    }

    public render() 
    {
        let displayClass = "ui-sidebar-notebook-item";
        displayClass += (this.props.isSelected)? " selected":"";

        return (
            <li className={displayClass} onClick={()=>this.onItemClick()}>
                <span></span> 
                <div className="ui-sidebar-notebook-item-title">{this.props.notebook.name}</div>
            </li>
        );
    }

}