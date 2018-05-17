// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

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

    public render() 
    {
        
        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean = this.props.editorStatus.selectedNotebook == notebook.id && this.props.editorStatus.mode == NoteListMode.Notebook;

            return  <NotebookItem key = {notebook.id} notebook={notebook} isSelected={selected} />
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
            </div>

        );
    }

}