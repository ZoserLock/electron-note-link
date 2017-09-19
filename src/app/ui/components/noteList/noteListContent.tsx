// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Notebook from "../../../notes/Notebook";

// UI
import UIManager from "../../uiManager"
import NoteListItem from "./noteListItem";

export default class NoteListContent extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddButtonClick()
    {
        let data =
        {
            storage:this.props.storage.id
        }

        UIManager.instance.sendMessage("action:NewNotebook",data);
    }

    public render() 
    {
        return (
            <div className="ui-note-list-content"> 
                <ul>
                    <NoteListItem/>
                    <NoteListItem/>
                    <NoteListItem/>
                    <NoteListItem/>
                    <NoteListItem/>
                    <NoteListItem/>
                </ul>
            </div>
        );
    }

}