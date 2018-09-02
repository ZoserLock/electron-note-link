// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/notebook";
import Message from "../../../core/message";

// UI
import NotebookItem from "./notebookItem";
import { NoteListMode } from "../../../../enums";

export default class StorageItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        Debug.log("Storage Item Created");
    }

    private onAddButtonClick()
    {
        let data =
        {
            storage:this.props.storage.id
        }

        ipcRenderer.send(Message.createNotebook,data);
    }

    private handleNotebookContextMenu(e:any, data:any, target:any):void
    {
        Debug.logVar(data);
        
        Debug.log(":: "+target.getAttribute("id"));
    }


    public render() 
    {
        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean = this.props.editorStatus.selectedNotebook == notebook.id && this.props.editorStatus.mode == NoteListMode.Notebook;

            return  (
            <ContextMenuTrigger id={"NotebookItem"} key = {notebook.id} attributes={{id:notebook.id}}>
                <NotebookItem  notebook={notebook} isSelected={selected} />
            </ContextMenuTrigger>
            )
        });

        let notebooks;

        if(notebookContent.length > 0)
        {
            notebooks = 
            (  
                <ul className="ui-sidebar-storage-item-notebooks">
                    {notebookContent}
                </ul>
            );
        }
        

        return (
            <div>
                <div className="ui-sidebar-storage-item"> 
                    <span>{this.props.storage.name}</span> 
                    <div className="ui-sidebar-storage-item-button-container">
                        <button className="ui-sidebar-storage-item-button" onClick={()=>this.onAddButtonClick()}></button>
                    </div>
                </div>
                {notebooks}    
                <ContextMenu id={"NotebookItem"}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Add Note' }}>Add Note</MenuItem> 
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Rename' }}>Rename Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Export' }}>Export Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Delete' }}>Delete Notebook</MenuItem> 
                </ContextMenu>
            </div>

        );
    }

}