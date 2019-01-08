// Node Modules
import * as React from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import applyOnClickOutside from 'react-onclickoutside'
import Debug from "tools/debug";

require("codemirror/mode/gfm/gfm");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/clike/clike");
require("codemirror/keyMap/sublime");

class NoteViewContentEditor extends React.Component<any, any> 
{
    private _codeMirror:any = null;

    private _scroll:number=0.0;

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

    private handleOnScroll(instance:any, scroll:any)
    {
        Debug.logVar(scroll);
       this._scroll = scroll.top;
    }

    public getScroll()
    {
        return this._scroll;
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
                <div className="ui-note-view-content-editor-toast" >
                    <button onClick={(event:any)=>this.handleClickOutside(event)}> Save </button>
                
                </div>
                <CodeMirror
                    editorDidMount={(editor) => { this.editorDidMount(editor)}}
                    value={this.state.code} 
                    options={options}
                    onChange={this.props.onCodeChanged}
                    onScroll={(instance:any,scroll:any)=>this.handleOnScroll(instance,scroll)}
                    scroll={{y:this.props.scroll}}
                />
            </div>
        );
    }
}

export default applyOnClickOutside(NoteViewContentEditor);
