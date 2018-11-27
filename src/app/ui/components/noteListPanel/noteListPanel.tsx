// Node.js
import * as React from "react";

// Presenter
import MessageChannel  from "presenter/messageChannel"

// UI
import UIComponent     from "ui/components/generic/uiComponent";
import NoteListHeader  from "ui/components/noteListPanel/noteListHeader"; 
import NoteListContent from "ui/components/noteListPanel/noteListContent"; 
import Debug from "tools/debug";


interface NoteListPanelState
{
    options:any;
    notes:ViewNoteItemData[];
    status:ViewCoreData;
    validFilter:boolean;
    forceUpdate:boolean;
    selectedRow:number;
}

export default class NoteListPanel extends UIComponent<any, NoteListPanelState> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;
    private _focusNoteEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state ={
            options:{},
            notes:[],
            status: {
                noteListMode:NoteListMode.Notebook,
                selectedNotebook:"",
                selectedNote:"",
                searchPhrase:""
            },
            validFilter:false,
            forceUpdate:true,
            selectedRow:-1, 
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(data);
        this._focusNoteEvent = (event:any,data:any)=>this.focusNote(data);
    }
    
    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
        this.registerMainListener(MessageChannel.focusNote, this._focusNoteEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
        this.unregisterMainListener(MessageChannel.focusNote, this._focusNoteEvent);
    }

    public updateRequested(data:any):void
    {
        // Change force update with ref ref={(ref) => this.list = ref}
        this.setState({
            options:data.options,
            notes:data.notes,
            status:data.status,
            validFilter: data.validFilter,
            forceUpdate:data.forceUpdate,
            selectedRow:-1
        });
        
    }

    public focusNote(data:any):void
    {
        if(data !=null && data.noteId != undefined)
        {
            let notes = this.state.notes;

            let noteIndex = -1;

            for(let a = 0;a < notes.length;++a)
            {
                if(notes[a].id == data.noteId)
                {
                    noteIndex=a;
                    break;
                }
            }

            if(noteIndex != -1)
            {
                this.setState({selectedRow:noteIndex});
            }
        }
    }

    public render() 
    {
        if(!this.state.validFilter)
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
                <NoteListHeader title = {this.state.options.title} mode = {this.state.status.noteListMode}/>
                <NoteListContent 
                    mode = {this.state.status.noteListMode} 
                    notes = {this.state.notes} 
                    selectedNote = {this.state.status.selectedNote} 
                    search = {this.state.status.searchPhrase} 
                    forceUpdate = {this.state.forceUpdate}
                    selectedRow = {this.state.selectedRow}
                />
            </div>
        );
    }
}