// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import * as Markdown from "markdown-it";

var markdownHighlight = require('markdown-it-highlightjs');
var markdownHashtag = require('markdown-it-hashtag');
var HtmlToReactParser = require('html-to-react').Parser;

interface NoteViewContentData
{
    text:string;
    onDoubleClick:any;
}

export default class NoteViewContent extends React.Component<NoteViewContentData, NoteViewContentData> 
{
    private _markdownRenderer:any;
    private _htmlParser:any;

    constructor(props: any)
    {
        super(props);
        this._markdownRenderer = new Markdown();            
        this._markdownRenderer.use(markdownHighlight);
        this._markdownRenderer.use(markdownHashtag);

        this._htmlParser = new HtmlToReactParser();
        
    }

    public render() 
    {
        if(this.props.text != null)
        {
            var htmlInput = this._markdownRenderer.render(this.props.text);
            var reactElement =  this._htmlParser.parse(htmlInput);

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