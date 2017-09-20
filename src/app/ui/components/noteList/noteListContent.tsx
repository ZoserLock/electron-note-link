// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import UIManager from "../../uiManager"
import NoteListItem from "./noteListItem";

export default class NoteListContent extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        let notes = this.props.notes.map((note:Note) =>
        {
            return  <NoteListItem key = {note.id} note = {note}/>
        });

        if(notes.length > 0)
        {
            return (
                <div className="ui-note-list-content"> 
                    <ul>
                    {notes}
                    </ul>
                </div>
            );    
        }

        return (
            <div className="ui-note-list-content"> 
            </div>
        );
    }

}