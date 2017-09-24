// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import * as Markdown from "markdown-it";

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import UIManager from "../../uiManager"

interface NoteViewContentData
{
    note:Note;
}

export default class NoteViewContentEditor extends React.Component<NoteViewContentData, NoteViewContentData> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <div className="ui-note-view-content"> 
                Content Editor
            </div>
        );
    }
}