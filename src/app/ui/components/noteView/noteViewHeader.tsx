// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";

// UI
import UIManager from "../../uiManager"

export default class NoteViewHeader extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private onAddNoteClick()
    {
       // UIManager.instance.sendMessage("action:NewNote");
    }

    public render() 
    {
        return (
            <div className="ui-note-view-header"> 
                Note View Header
            </div>

        );
    }

}