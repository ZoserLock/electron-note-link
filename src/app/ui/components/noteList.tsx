import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";
import Debug from "../../tools/debug";

// UI
import UIManager from "../uiManager";
import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 

export default class NoteList extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            notes:[]
        }
    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteList",(event:any,data:any)=>this.updateRequested(event,data));

        UIManager.instance.sendMessage("update:NoteList");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteList",(event:any,data:any)=>this.updateRequested(event,data));
    }

    public updateRequested(event:any, data:any):void
    {
        let notes:Note[] = data.notes.map((noteData:any) =>
        {
            return Note.createFromData(noteData);
        });

        Debug.logVar(notes);
        this.setState({notes:notes});
    }


    public render() 
    {
        return (
            <div className="ui-note-list">
                <NoteListHeader/>
                <NoteListContent notes = {this.state.notes}/>
            </div>
        );
    }

}