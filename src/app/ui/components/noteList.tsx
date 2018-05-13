import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";

// UI
import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 

export default class NoteList extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            type:"Notebook",
            notes:[]
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(event,data);

    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteList",this._updateRequestedEvent);
        ipcRenderer.send("update:NoteList");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteList",this._updateRequestedEvent);
    }

    public updateRequested(event:any, data:any):void
    {
        if(data.update == undefined || !data.update)
        {
            this.setState({notes:data.notes,mode:data.mode});
        }
        else
        {
            let newNotes:any[] = this.state.notes;

            newNotes.push.apply(newNotes, data.notes);
       
            this.setState({notes:newNotes,mode:data.mode});
        }
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