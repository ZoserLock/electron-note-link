// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import UIManager from "../../uiManager"

interface NoteListItemData
{
    note:Note;
}

export default class NoteListItem extends React.Component<NoteListItemData, NoteListItemData> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onItemClick()
    {
       /* let data =
        {
            storage:this.props.storage.id
        }

        UIManager.instance.sendMessage("action:NewNotebook",data);*/
    }

    public render() 
    {
        return (
            <li className="ui-note-list-item" onClick={()=>this.onItemClick()}>
                <span>{this.props.note.title}</span> 
            </li>
        );
    }

}