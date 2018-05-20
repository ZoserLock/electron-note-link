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
        return(
            <li className="ui-note-list-item">
                <EditableText 
                    value = {this.props.note.title} 
                    onClick={()=>this.onItemClick()} 
                    onEditFinished={(text:string)=>this.editFinished(text)}

                />
            </li>
        )
    }
}
