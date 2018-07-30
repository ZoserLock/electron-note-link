// Global
import { ipcRenderer } from "electron";
import * as React from "react";

// Local
import Debug from "../../../tools/debug";
import Message from "../../../core/message";


export default class NoteViewHeader extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private OnStartedClick()
    {
        Debug.log("Started: " + this.props.note.started);

        let data =
        {
            id:this.props.note.id,
            started:!this.props.note.started,
        }
        
        Debug.log("Next Started State: "+data.started);
        ipcRenderer.send(Message.updateNote, data);
    }
    
    public render() 
    {
        if(this.props.note)
        {
            return (
                <div className="ui-note-view-header-content"> 
                    <div className="ui-note-view-header"> 
                        <div className="ui-note-view-header-title-container"> 
                            <div className="ui-note-view-header-title"> 
                                <button onClick={()=>this.OnStartedClick()}> Started </button>
                                {this.props.note.title}
                            </div>
                        </div>
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