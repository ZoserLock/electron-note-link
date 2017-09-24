// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import reactOnClickOutside from 'react-onclickoutside'

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

    // myAdd: (baseValue: number, increment: number) => number 

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null,
            editorMode:false
        }
    }
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:NoteView",(event:any,data:any)=>this.updateRequested(event,data));

        UIManager.instance.sendMessage("update:NoteView");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:NoteView",(event:any,data:any)=>this.updateRequested(event,data));
    }

    public updateRequested(event:any, data:any):void
    {
        let note:Note = Note.createFromData(data.note);
        this.setState({note:note});
    }

    private handleClickOutside(event:any)
    {
        this.setState({editorMode:false});
    }

    private onContentClick()
    {
        this.setState({editorMode:true});
    }

    public render() 
    {
        let currentPanel =  <NoteViewContent note={this.state.note} onClick={()=>this.onContentClick()}/>

        if(this.state.editorMode)
        {
            currentPanel =  <NoteViewContentEditor code={this.state.note.text}/>
        }

        return (
            <div className="ui-note-view"> 
                <NoteViewHeader/>
                {currentPanel}
            </div>
        );
    }

}

export default reactOnClickOutside(NoteView);
