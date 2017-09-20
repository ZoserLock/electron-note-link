import * as React from "react";
import {ipcRenderer} from "electron"; 

import Note from "../../notes/note";
import Debug from "../../tools/debug";

// UI
import UIManager from "../uiManager";
import NoteListHeader from "./noteList/noteListHeader"; 
import NoteListContent from "./noteList/noteListContent"; 

export default class NoteView extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:[]
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
        /*let notes:Note[] = data.notes.map((noteData:any) =>
        {
            return Note.createFromData(noteData);
        });

        this.setState({notes:notes});*/
    }


    public render() 
    {
        return (
            <div className="ui-note-view"> Right Viewport</div>
        );
    }

}