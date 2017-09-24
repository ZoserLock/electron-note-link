// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import * as CodeMirror from "react-codemirror";
import 'codemirror/mode/markdown/markdown.js';

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import UIManager from "../../uiManager"

export default class NoteViewContentEditor extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.state =
        {
            code:this.props.code
        }
    }

    private updateCode(newCode:string)
    {
        this.setState({
            code: newCode,
        });
    }

    public render() 
    {
        var options = 
        {
            lineNumbers: true,
            lineWrapping:true,
            mode:"text/x-markdown",
            highlightFormatting:true
        };

        return (
            <div className="ui-note-view-content-editor"> 
                <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
            </div>
        );
    }
}