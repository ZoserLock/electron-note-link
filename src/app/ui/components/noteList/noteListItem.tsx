// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Notebook from "../../../notes/Notebook";

// UI
import UIManager from "../../uiManager"

export default class NoteListItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onItemClick()
    {
        let data =
        {
            storage:this.props.storage.id
        }

        UIManager.instance.sendMessage("action:NewNotebook",data);
    }

    public render() 
    {
        return (
            <li className="ui-note-list-item" onClick={()=>this.onItemClick()}>
                <span>Note</span> 
            </li>

        );
    }

}