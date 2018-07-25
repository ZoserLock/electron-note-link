// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/notebook";
import Message from "../../../core/message";

// UI

export default class NoteListHeader extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddNoteClick()
    {
        ipcRenderer.send(Message.createNote);
    }

    public render() 
    {
        return (
            <div className="ui-note-list-header-container"> 
                <div className="ui-note-list-header">
                    <div className="ui-note-list-header-title"> {this.props.title} </div>
                    <button className = "ui-note-list-header-button" onClick={()=>this.onAddNoteClick()}></button>
                </div>
                <div className="ui-note-list-header-list-separator" />
            </div>
        );
    }
}