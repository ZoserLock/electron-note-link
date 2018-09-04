// Node Modules
import * as React from "react";
import * as Markdown from "markdown-it";

const markdownHighlight = require('markdown-it-highlightjs');
const markdownHashtag   = require('markdown-it-hashtag');
const HtmlToReactParser = require('html-to-react').Parser;

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

    // add should update text == new text

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