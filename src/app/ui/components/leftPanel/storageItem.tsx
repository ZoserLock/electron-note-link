// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/Notebook";

// UI
import UIManager from "../../uiManager"

interface StorageItemData
{
    storage:NotebookStorage;
}

export default class StorageItem extends React.Component<StorageItemData, StorageItemData> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddButtonClick()
    {
        let data =
        {
            storage:this.props.storage.id
        }

        UIManager.instance.sendMessage("action:NewNotebook",data);
    }

    public render() 
    {
        let notebooks = this.props.storage.notebooks.map((notebookData:any) =>
        {
            let notebook = Notebook.createFromData(notebookData);
            return  <li key = {notebook.id}>{notebook.id}</li>
        });

        return (
            <div>
                <div className="ui-sidebar-storage-item"> 
                    <span>{this.props.storage.name}</span> 
                    <button onClick={()=>this.onAddButtonClick()}>+</button>
                </div>
                <ul className="wtree">
                    {notebooks}
                </ul>
            </div>

        );
    }

}