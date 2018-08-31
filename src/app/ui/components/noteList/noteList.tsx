import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../../notes/note";

// UI
import NoteListHeader from "./noteListHeader"; 
import NoteListContent from "./noteListContent"; 
import { NoteListMode } from "../../../../enums";
import Debug from "../../../tools/debug";

export default class NoteList extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;
    private _updateSearchRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            title:"",
            notes:[],
            mode: NoteListMode.Notebook,
            selectedNote:"",
            forceUpdate:true,
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(data);
        this._updateSearchRequestedEvent = (event:any,data:any)=>this.updateSearchRequested(data);

    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteList",this._updateRequestedEvent);
        ipcRenderer.addListener("update:Search",this._updateSearchRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteList",this._updateRequestedEvent);
        ipcRenderer.removeListener("update:Search",this._updateSearchRequestedEvent);
    }

    public updateSearchRequested(data:any):void
    {
        this.setState({search:data.search});
    }

    public updateRequested(data:any):void
    {
        // Change force update with ref ref={(ref) => this.list = ref}
        this.setState({
            title:data.title,
            notes:data.notes,
            mode:data.mode,
            selectedNote:data.selectedNote, 
            forceUpdate:data.forceUpdate
        });
    }

    public render() 
    {
        if(this.state.mode == NoteListMode.Disabled)
        {
            return (
                <div className="ui-note-list">
                    <div className="ui-note-list-content"> 
                        
                    </div>
                </div>
            );
        }

        return (
            <div className="ui-note-list">
                <NoteListHeader title = {this.state.title} mode = {this.state.mode}/>
                <NoteListContent mode = {this.state.mode} notes = {this.state.notes} selectedNote = {this.state.selectedNote} search={this.state.search} forceUpdate = {this.state.forceUpdate}/>
            </div>
        );
    }

}