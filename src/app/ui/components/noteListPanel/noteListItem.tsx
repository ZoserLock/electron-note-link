// Node.js
import * as React from "react";
import * as moment from 'moment';

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent  from "ui/components/generic/uiComponent";
import EditableText from "ui/components/generic/editableText";
import Debug from "tools/debug";

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

    public editFinished(text:string):void
    {
        let data:NoteUpdateData = 
        {
            id:this.props.note.id,
            title:text
        }

        this.sendMainMessage(MessageChannel.updateNote,data);
    }

    private handleDragStart(event:React.DragEvent)
    {
        let noteId = this.props.note.id;
        event.dataTransfer.setData("noteId",noteId);
    }

    private handleDragEnd(event:React.DragEvent)
    {
        Debug.log("Drag End");
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
            <li className="ui-note-list-item" onClick={()=>this.onItemClick()} 
                draggable={true}
                onDragStart={(event)=>this.handleDragStart(event)}
                onDragEnd ={(event)=>this.handleDragEnd(event)}>
                <div className = {"ui-note-list-item-content" + addClass}>
                    <div className = "ui-note-list-item-header" >
                        <span className ="badge"></span>
                        <span className ="text">{this.props.note.notebookName}</span>
                        <span className ="spacer"/>
                        <span className ="date"> {date}</span>
                    </div>
                    <div className="ui-note-list-item-title-container" >
                        <EditableText 
                            allowDoubleClick = {true}
                            isSelected ={this.props.isSelected}
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
