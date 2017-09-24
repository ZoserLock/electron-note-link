import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";
import Debug from "../../tools/debug";

// UI
import UIManager from "../uiManager";
import NoteViewHeader from "./noteView/noteViewHeader"; 
import NoteViewContent from "./noteView/noteViewContent";

interface NoteViewData
{
    note:Note;
}

export default class NoteView extends React.Component<any, NoteViewData> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null
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

      /*  Debug.log("Text: " + note.text);
        Debug.log("Title:" + note.title);
        Debug.logVar(data);*/

        this.setState({note:note});
    }


    public render() 
    {
        let currentPanel =  <NoteViewContent note={this.state.note}/>

        return (
            <div className="ui-note-view"> 
                <NoteViewHeader/>
                {currentPanel}
            </div>
        );
    }

}