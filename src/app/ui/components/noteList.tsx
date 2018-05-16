import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";

// UI
import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 
import { NoteListMode } from "../../../enums";
import Debug from "../../tools/debug";

export default class NoteList extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            notes:[],
            mode: NoteListMode.Notebook,
            selectedNote:""
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(data);

    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteList",this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteList",this._updateRequestedEvent);
    }

    public updateRequested(data:any):void
    {
        this.setState({notes:data.notes,mode:data.mode,selectedNote:data.selectedNote});
    }

    public render() 
    {
        return (
            <div className="ui-note-list">
                <NoteListHeader mode   = {this.state.mode}/>
                <NoteListContent notes = {this.state.notes} selectedNote={this.state.selectedNote}/>
            </div>
        );
    }

}