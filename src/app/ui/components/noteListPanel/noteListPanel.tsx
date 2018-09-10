// Node.js
import * as React from "react";

// Presenter
import MessageChannel  from "presenter/messageChannel"

// UI
import UIComponent     from "ui/components/generic/uiComponent";
import NoteListHeader  from "ui/components/noteListPanel/noteListHeader"; 
import NoteListContent from "ui/components/noteListPanel/noteListContent"; 


interface NoteListPanelState
{
    options:any;
    notes:ViewNoteItemData[];
    status:ViewCoreData;
    validFilter:boolean;
    forceUpdate:boolean;
}

export default class NoteListPanel extends UIComponent<any, NoteListPanelState> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

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
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(data);
    }
    
    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
    }

    public updateRequested(data:any):void
    {
        // Change force update with ref ref={(ref) => this.list = ref}
        this.setState({
            options:data.options,
            notes:data.notes,
            status:data.status,
            validFilter: data.validFilter,
            forceUpdate:data.forceUpdate
        });
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
                />
            </div>
        );
    }
}