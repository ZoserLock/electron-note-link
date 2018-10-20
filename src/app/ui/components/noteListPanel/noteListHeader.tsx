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
        let data = {}

        this.sendMainMessage(MessageChannel.createNote, data);
    }

    public render() 
    {
        let iconName:string = "library_books";
        let addButton:any;

        if(this.props.mode == NoteListMode.Notebook)
        {
            iconName="library_books";
            addButton = (
            <div className="ui-note-list-header-button-container">
                <button className = "ui-note-list-header-button" onClick={()=>this.handleAddNoteClick()}></button>
            </div>)
        }
        else if(this.props.mode == NoteListMode.Search)
        {
            iconName = "search";
        }
        else if(this.props.mode == NoteListMode.All)
        {
            iconName = "collections_bookmark";
        }
        else if(this.props.mode == NoteListMode.Started)
        {
            iconName = "star";
        }  
        else if(this.props.mode == NoteListMode.Trash)
        {
            iconName = "delete";
        }  

        return (
            <div className="ui-note-list-header-container"> 
                <div className="ui-note-list-header">
                    <div className="valign-center ui-note-list-header-icon">
                        <i className="material-icons">{iconName}</i>
                    </div>
                    <div className="ui-note-list-header-title"> {this.props.title} </div>
                    {addButton}
                </div>
                <div className="ui-note-list-header-list-separator" />
            </div>
        );
    }
}