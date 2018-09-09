// Node.js
import * as React from "react";
import * as moment from 'moment';

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent  from "ui/components/generic/uiComponent";
import EditableText from "ui/components/generic/editableText";

export default class NoteListItem extends UIComponent<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            editing:false,
            editingText:""
        }
    }

    private onItemClick()
    {
        let data = {noteId:this.props.note.id}

        this.sendMainMessage(MessageChannel.selectNote,data);
    }

    private onItemDelete()
    {
        let data ={noteId:this.props.note.id}

        this.sendMainMessage(MessageChannel.removeNote,data);
    }

    public editFinished(text:string):void
    {
        let data:NoteUpdateData = 
        {
            id:this.props.note.id,
            title:text
        }

        this.sendMainMessage(MessageChannel.updateNote,data);
    }

    public render() 
    {
        let value:string = (this.props.note.title == "")?"<Empty>":this.props.note.title;

        let date = moment(this.props.note.updated).fromNow();

        let addClass = "";
        
        if(this.props.isSelected )
        {
            addClass = " selected";
        }

        return(
            <li className="ui-note-list-item" onClick={()=>this.onItemClick()} >
                <div className = {"ui-note-list-item-content" + addClass}>
                    <div className = "ui-note-list-item-header" >
                        <span className ="ui-note-list-item-badge">
                        </span><span>{this.props.note.notebook}</span>
                        <span className="ui-inline-spacer"/><span>{date}</span>
                    </div>
                    <div className="ui-note-list-item-title-container" >
                        <EditableText 
                            normalClass = {"ui-note-list-item-title"+ addClass}
                            editContClass = "ui-note-list-item-title-edit-container"
                            editClass ="ui-note-list-item-title-edit"
                            value = {value} 
                            onEditFinished={(text:string)=>this.editFinished(text)}
                        />
                    </div>
                </div>
                <div className="ui-note-list-item-list-separator" />
            </li>
        )
    }
}
