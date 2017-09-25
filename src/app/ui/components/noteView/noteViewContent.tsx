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
    text:string;
    onDoubleClick:any;
}

export default class NoteViewContent extends React.Component<NoteViewContentData, NoteViewContentData> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        Debug.log("NoteViewContent Render");
        if(this.props.text != null)
        {
            var md = new Markdown();            
            var htmlInput = md.render(this.props.text);
            var htmlToReactParser = new HtmlToReactParser();
            var reactElement = htmlToReactParser.parse(htmlInput);

            return (
                <div className="ui-note-view-content" onDoubleClick={this.props.onDoubleClick}> 
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