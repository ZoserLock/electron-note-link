// Node.js
import * as React from "react";

// Presenter
import MessageChannel  from "presenter/messageChannel"

// UI
import UIComponent     from "ui/components/generic/uiComponent";
import NoteListHeader  from "ui/components/noteListPanel/noteListHeader"; 
import NoteListContent from "ui/components/noteListPanel/noteListContent"; 

export default class NoteListPanel extends UIComponent<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

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

        this._updateRequestedEvent       = (event:any,data:any)=>this.updateRequested(data);

    }
    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNoteListPanel,this._updateRequestedEvent);
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