// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import applyOnClickOutside from 'react-onclickoutside'

// Local
import Note from "../../../notes/note";
import Debug from "../../../tools/debug";

// UI
import NoteViewHeader from "./noteViewHeader"; 
import NoteViewContent from "./noteViewContent";
import NoteViewContentEditor from "./noteViewContentEditor";
import Message from "../../../core/message";

interface NoteViewData
{
    note:Note;
    editorMode:boolean;
}

class NoteView extends React.Component<any, NoteViewData> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;
    private _newText:string ="";

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null,
            editorMode:false
        }

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(event,data);
    }
    public componentDidMount() 
    {
        ipcRenderer.addListener(Message.updateNoteView,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(Message.updateNoteView,this._updateRequestedEvent);
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editorMode)
        {
            this.setState({editorMode:false});
            ipcRenderer.send(Message.updateNote,{id:this.state.note.id,text:this._newText});
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

export default applyOnClickOutside(NoteView);
