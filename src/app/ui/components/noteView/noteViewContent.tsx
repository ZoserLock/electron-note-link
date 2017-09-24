// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import * as Markdown from "markdown-it";

var HtmlToReactParser = require('html-to-react').Parser;

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import UIManager from "../../uiManager"

interface NoteViewContentData
{
    note:Note;
}

export default class NoteViewContent extends React.Component<NoteViewContentData, NoteViewContentData> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        if(this.props.note != null)
        {
            var md = new Markdown();            
            var htmlInput = md.render(this.props.note.text);
            var htmlToReactParser = new HtmlToReactParser();
            var reactElement = htmlToReactParser.parse(htmlInput);

            return (
                <div className="ui-note-view-content"> 
                    {reactElement}
                </div>
            );
        }

        return (
            <div className="ui-note-view-content"> 
                No note selected
            </div>
        );
    }

}