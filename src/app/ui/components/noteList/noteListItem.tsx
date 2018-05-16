// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";
import Message from "../../../core/message";

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
            noteId:this.props.note.id
        }

        ipcRenderer.send(Message.selectNote,data);
    }

    public render() 
    {
        let displayClass = "ui-note-list-item";

        let seletected:boolean = this.props.isSelected;
        
        return (
            <li className={displayClass} onClick={()=>this.onItemClick()}>
                <span>{this.props.note.title+" "+seletected}</span> 
            </li>
        );
    }

}