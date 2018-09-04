// Node.js
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";

export default class NoteListHeader extends UIComponent<any, any> 
{
    private handleAddNoteClick()
    {
        this.sendMainMessage(MessageChannel.createNote);
    }

    public render() 
    {
        let iconClass:string = "";
        let addButton:any;

        if(this.props.mode == NoteListMode.Notebook)
        {
            iconClass="icon-notebook";
            addButton = (
            <div className="ui-note-list-header-button-container">
                <button className = "ui-note-list-header-button" onClick={()=>this.handleAddNoteClick()}></button>
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