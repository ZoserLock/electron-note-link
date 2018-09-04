// Node Modules
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";


export default class NoteViewHeader extends UIComponent<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private OnStartedClick()
    {
        let data =
        {
            id:this.props.note.id,
            started:!this.props.note.started,
        }
        
        this.sendMainMessage(MessageChannel.updateNote, data);
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
                                    {this.props.note.title}
                                </div>
                            <div className="ui-inline-spacer"></div>
                            <button className={started} onClick={()=>this.OnStartedClick()}></button>
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