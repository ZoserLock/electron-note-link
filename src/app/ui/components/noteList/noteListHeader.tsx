// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import NotebookStorage from "../../../notes/notebookStorage";
import Notebook from "../../../notes/notebook";
import Message from "../../../core/message";
import { NoteListMode } from "../../../../enums";

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
        let iconClass:string ="";
        let addButton:any;

        if(this.props.mode == NoteListMode.Notebook)
        {
            iconClass="icon-notebook";
            addButton = (
            <div className="ui-note-list-header-button-container">
                <button className = "ui-note-list-header-button" onClick={()=>this.onAddNoteClick()}></button>
            </div>)
        }
        else if(this.props.mode == NoteListMode.Search)
        {
            iconClass="icon-search";
        }
        else if(this.props.mode == NoteListMode.All)
        {
            iconClass="icon-all-notes";
        }
        else if(this.props.mode == NoteListMode.Started)
        {
            iconClass="icon-star";
        }  
        else if(this.props.mode == NoteListMode.Trash)
        {
            iconClass="icon-trash";
        }  

        iconClass += " ui-note-list-header-icon";

        return (
            <div className="ui-note-list-header-container"> 
                <div className="ui-note-list-header">
                    <div className={iconClass}/>
                    <div className="ui-note-list-header-title"> {this.props.title} </div>
                    {addButton}
                </div>
                <div className="ui-note-list-header-list-separator" />
            </div>
        );
    }
}