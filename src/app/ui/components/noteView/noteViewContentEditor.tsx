// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import {UnControlled as CodeMirror} from 'react-codemirror2'

require("codemirror/mode/gfm/gfm");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/clike/clike");
require("codemirror/keyMap/sublime");

// Local
import Debug from "../../../tools/debug";

export default class NoteViewContentEditor extends React.Component<any, any> 
{
    private _codeMirror:any = null;

    constructor(props: any)
    {
        super(props);
        this.state =
        {
            code:this.props.code
        }
    }

    private editorDidMount(editor:any)
    {
        this._codeMirror = editor; 
        this._codeMirror.setSize("100%", "100%");
    }

    public render() 
    {
        var options = 
        {
            lineNumbers: true,
            lineWrapping:true,
            keyMap:"sublime",
            theme:"twilight",
            mode:"text/x-gfm",
            tabSize:4,
            indentUnit:4,
            highlightFormatting:true,
        };

        return (
            <div className="ui-note-view-content-editor"> 
                <CodeMirror
                    editorDidMount={(editor) => { this.editorDidMount(editor)}}
                    value={this.state.code} 
                    options={options}
                    onChange={this.props.onCodeChanged}
                    onScroll={(editor, data) => {Debug.logVar(data)}}
                />
            </div>
        );
  

    }
}