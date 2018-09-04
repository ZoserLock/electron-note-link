// Node Modules
import * as React from "react";
import applyOnClickOutside from 'react-onclickoutside'

// Local
import Note from "core/data/note";

// Tools
import Debug from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent           from "ui/components/generic/uiComponent";
import NoteViewHeader        from "ui/components/noteViewPanel/noteViewHeader"; 
import NoteViewContent       from "ui/components/noteViewPanel/noteViewContent";
import NoteViewContentEditor from "ui/components/noteViewPanel/noteViewContentEditor";

interface NoteViewData
{
    note:Note;
    editorMode:boolean;
}

class NoteViewPanel extends UIComponent<any, NoteViewData> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    private _newText:string = "";

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null,
            editorMode:false
        }

        this._updateRequestedEvent = (event:any,data:any) => this.updateRequested(event,data);
    }

    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNoteViewPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNoteViewPanel,this._updateRequestedEvent);
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editorMode)
        {
            this.setState({editorMode:false});
            this.sendMainMessage(MessageChannel.updateNote,{id:this.state.note.id,text:this._newText})
            event.stopImmediatePropagation();
        }
    }

    private onContentClick()
    {
        this.setState({editorMode:true});
    }

    private onCodeChanged(editor:any, data:any, value:any)
    {
        this._newText = value;
    }

    public updateRequested(event:any, data:any):void
    {
        Debug.log("updateRequested Note View");

        if(data.note != null)
        {
            this._newText = data.note.text;
        }
        else
        {
            this._newText = "";
        }
       

        this.setState({note:data.note});
    }

    public render() 
    {
        let currentPanel:any;

        if(this.state.note != null)
        {
            Debug.logVar(this.state.note);
            if(this.state.editorMode)
            {
                currentPanel = <NoteViewContentEditor code = {this.state.note.text} onCodeChanged = {(editor:any, data:any, value:any)=>this.onCodeChanged(editor,data,value)}/>
            }
            else
            {
                currentPanel = <NoteViewContent text = {this.state.note.text} onDoubleClick={()=>this.onContentClick()}/>
            }

            return (
                <div className="ui-note-view"> 
                    <NoteViewHeader note = {this.state.note}/>
                    {currentPanel}
                </div>
            );
        }
        else
        {
            return (
            <div className="ui-note-view"> 
                <div className="center"> 
                    No note selected
                </div> 
            </div>
            );
        }
    }
}

export default applyOnClickOutside(NoteViewPanel);
