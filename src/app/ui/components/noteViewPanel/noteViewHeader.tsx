// Node Modules
import * as React from "react";

// Tools
import Debug from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";
import EditableText from "ui/components/generic/editableText";

export default class NoteViewHeader extends UIComponent<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onStartedClick()
    {
        let data:NoteUpdateData =
        {
            id:this.props.note.id,
            started:!this.props.note.started,
        }

        Debug.logVar(data);
        
        this.sendMainMessage(MessageChannel.updateNote, data);
    }

    private editFinished(text:string)
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
        if(this.props.note)
        {
            let started = this.props.note.started?"icon-star-fill":"icon-star";

            return (
                <div className="ui-note-view-header-content"> 
                        <div className="ui-note-view-header-container"> 
                                <div className="ui-note-view-header-title"> 
                                <EditableText 
                                    allowDoubleClick = {true}
                                    isSelected ={this.props.isSelected}
                                    value = {this.props.note.title} 
                                    onEditFinished={(text:string)=>this.editFinished(text)}
                                />
                                </div>

                            <div className="ui-inline-spacer"></div>
                            <button className={started} onClick={()=>this.onStartedClick()}></button>
                        </div>
                <div className="ui-note-view-header-separator"/> 
                </div>
            );   
        }

        return (
            <div className="ui-note-view-header"> 
                Note not selected
            </div>
        );
    }

}