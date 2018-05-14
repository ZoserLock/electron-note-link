import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";

// UI
import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 
import { NoteListMode } from "../../../enums";
import UICache from "../uiCache";
import Debug from "../../tools/debug";

export default class NoteList extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            notes:[]
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested();

    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteList",this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteList",this._updateRequestedEvent);
    }

    public updateRequested():void
    {
        let mode:number = UICache.instance.noteListMode;
        let notes:any[] = [];

        if(mode == NoteListMode.All)
        {
            notes = UICache.instance.notes;
        }
        if(mode == NoteListMode.Notebook)
        {
            let notebook:any = UICache.instance.getSelectedNotebook();

            if(notebook != null)
            {
                notes = notebook.notes;
            }
            Debug.log("Note count;: "+notes.length);
        }
        this.setState({notes:notes,mode:mode});
    }

    public render() 
    {
        return (
            <div className="ui-note-list">
                <NoteListHeader mode   = {this.state.mode}/>
                <NoteListContent notes = {this.state.notes}/>
            </div>
        );
    }

}