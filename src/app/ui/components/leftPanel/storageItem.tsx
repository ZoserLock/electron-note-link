// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";

// UI
import UIManager from "../../uiManager"

export default class storageItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            isSelected:false
        }  
    }

    private onAddButtonClick()
    {
        let data =
        {
            storage:this.props.storage._id
        }

        UIManager.instance.sendMessage("action:NewNotebook",data);
    }

    public render() 
    {
        return (
            <div className="ui-sidebar-storage-item"> 
                <span>{this.props.storage._id}</span> 
                <button onClick={()=>this.onAddButtonClick()}>+</button>
            </div>
        );
    }

}