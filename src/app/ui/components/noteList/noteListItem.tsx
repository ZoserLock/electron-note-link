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
        let data =
        {
            noteId:this.props.note.id
        }

        UIManager.instance.sendMessage("action:SelectNote",data);
    }

    public render() 
    {
        let displayClass = "ui-note-list-item";

        displayClass += (this.props.note.isSelected)? " selected": "";
      
        return (
            <li className={displayClass} onClick={()=>this.onItemClick()}>
                <span>{this.props.note.title}</span> 
            </li>
        );
    }

}