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

    private onUnlinkButtonClick()
    {
        let data =
        {
            storage:this.props.storage.id
        }

        ipcRenderer.send(Message.removeStorage, data);
    }

    private handleNotebookContextMenu(e:any, data:any, target:any)
    {
    }


    public render() 
    {
        
        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean = this.props.editorStatus.selectedNotebook == notebook.id && this.props.editorStatus.mode == NoteListMode.Notebook;

            return  (
            <ContextMenuTrigger id={"NOTEBOOK_CONTEXT_MENU"} key = {notebook.id}>
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
                    <button onClick={()=>this.onAddButtonClick()}>+</button>
                    <button onClick={()=>this.onUnlinkButtonClick()}>-</button>
                </div>
                {notebooks}    
                <ContextMenu id={"NOTEBOOK_CONTEXT_MENU"}>
                    <MenuItem onClick={(e:any, data:any, target:any)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Added' }}>Add 1 count</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:any)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Removed' }}>Remove 1 count</MenuItem>
                </ContextMenu>
            </div>

        );
    }

}