// Node Modules
import * as React from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import applyOnClickOutside from 'react-onclickoutside'

require("codemirror/mode/gfm/gfm");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/clike/clike");
require("codemirror/keyMap/sublime");

class NoteViewContentEditor extends React.Component<any, any> 
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

        // Hack for now to avoid the bad cursor size on the first render
        setTimeout(()=>{this._codeMirror.refresh()}, 100);
    }

    private handleClickOutside(event:any)
    {
        this.props.onClickOutside(event); 
    }

    public render() 
    {
        // Move to const
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
                />
            </div>
        );
    }
}

export default applyOnClickOutside(NoteViewContentEditor);
