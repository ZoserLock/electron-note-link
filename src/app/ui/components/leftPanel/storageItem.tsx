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
import UICache from "../../uiCache";

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
        let selectedNoteobook:string = UICache.instance.selectedNotebook;
        let mode:number = UICache.instance.noteListMode;

        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            return  <NotebookItem key = {notebook.id} notebook={notebook} mode = {mode} isSelected={selectedNoteobook==notebook.id} />
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