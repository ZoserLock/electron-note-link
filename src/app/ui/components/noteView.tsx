// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import applyOnClickOutside from 'react-onclickoutside'

// Local
import Note from "../../notes/note";
import Debug from "../../tools/debug";

// UI
import UIManager from "../uiManager";
import NoteViewHeader from "./noteView/noteViewHeader"; 
import NoteViewContent from "./noteView/noteViewContent";
import NoteViewContentEditor from "./noteView/noteViewContentEditor";

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
        ipcRenderer.addListener("update:NoteView",this._updateRequestedEvent);

        UIManager.instance.sendMessage("update:NoteView");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteView",this._updateRequestedEvent);
    }

    public componentWillUpdate(nextProps:any, nextState:NoteViewData)
    {
        if(this.state.editorMode == true && nextState.editorMode == false)
        {
            Debug.log("Updating: "+this.state.note.title);
            UIManager.instance.sendMessage("action:UpdateNote",{id:this.state.note.id,text:this._newText});
        }
    }

    private handleClickOutside(event:any)
    {
        this.setState({editorMode:false});
    }

    private onContentClick()
    {
        this.setState({editorMode:true});
    }

    private onCodeChanged(newCode:any)
    {
        Debug.log("Code Changed");
        this._newText = newCode;
    }

    public updateRequested(event:any, data:any):void
    {
        let note:Note = Note.createFromData(data.note);
        this._newText = note.text;
        this.setState({note:note});
    }

    public render() 
    {
        let currentPanel;

        if(this.state.note != null)
        {
            if(this.state.editorMode)
            {
                currentPanel = <NoteViewContentEditor code={this.state.note.text} onCodeChanged = {(code:any)=>this.onCodeChanged(code)}/>
            }
            else
            {
                currentPanel = <NoteViewContent text={this.state.note.text} onDoubleClick={()=>this.onContentClick()}/>
            }
        }

        return (
            <div className="ui-note-view"> 
                <NoteViewHeader/>
                {currentPanel}
            </div>
        );
    }

}

export default applyOnClickOutside(NoteView);