// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/notebook";

// UI
import UIManager from "../../uiManager"

export default class NoteListHeader extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddNoteClick()
    {
        UIManager.instance.sendMessage("action:NewNote");
    }

    public render() 
    {
        return (
            <div className="ui-note-list-header"> 
                Note List
                <button onClick={()=>this.onAddNoteClick()}>+</button>
            </div>

        );
    }

}