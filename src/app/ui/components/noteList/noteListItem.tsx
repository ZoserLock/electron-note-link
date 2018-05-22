// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import applyOnClickOutside from 'react-onclickoutside'

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";
import Message from "../../../core/message";

import EditableText from "../generic/editableText";


export default class NoteListItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            editing:false,
            editingText:""
        }
    }

    private onItemClick()
    {
        let data = {noteId:this.props.note.id}

        ipcRenderer.send(Message.selectNote,data);
    }

    private onItemDelete()
    {
        let data ={noteId:this.props.note.id}

        ipcRenderer.send(Message.removeNote,data);
    }

    public editFinished(text:string):void
    {
        let data = 
        {
            id:this.props.note.id,
            title:text
        }

        ipcRenderer.send(Message.updateNote,data);
    }

    public render() 
    {
        let value:string=(this.props.note.title == "")?"<Empty>":this.props.note.title;
        return(
            <li className="ui-note-list-item">
                <EditableText 
                    value = {value} 
                    onClick={()=>this.onItemClick()} 
                    onEditFinished={(text:string)=>this.editFinished(text)}
                />
            </li>
        )
    }
}
