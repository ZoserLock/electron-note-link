// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/notebook";

// UI
import NotebookItem from "./notebookItem";

interface StorageItemData
{
    storage:NotebookStorage;
}

export default class StorageItem extends React.Component<StorageItemData, StorageItemData> 
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

        ipcRenderer.send("action:NewNotebook",data);
    }

    public render() 
    {
        let notebookContent = this.props.storage.notebooks.map((notebookData:any) =>
        {
            let notebook = Notebook.createFromData(notebookData);
            return  <NotebookItem key = {notebook.id} notebook={notebook}/>
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
                </div>
                {notebooks}
            </div>

        );
    }

}