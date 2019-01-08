// Node Modules
import * as React from "react";
// Local
import Note from "core/data/note";

// Tools
import Debug from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent           from "ui/components/generic/uiComponent";
import NoteViewHeader        from "ui/components/noteViewPanel/noteViewHeader"; 
import NoteViewContent       from "ui/components/noteViewPanel/noteViewContent";
import NoteViewContentEditor from "ui/components/noteViewPanel/noteViewContentEditor";

interface NavigationPanelState
{
    note:ViewNoteFullItemData;
    scroll:number;
    editing:boolean;
}

export default class NoteViewPanel extends UIComponent<any, NavigationPanelState> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    private _getComponentReference: (ref: any) => void;

    private _newText:string = "";

    private _viewContentEditor:any;
    private _viewContent:React.RefObject<NoteViewContent>;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null,
            scroll:0,
            editing:false
        }

        this._updateRequestedEvent = (event:any,data:any) => this.updateRequested(event,data);
        this._getComponentReference = (data:any)=>this.getReference(data);
        
        this._viewContent = React.createRef<NoteViewContent>();
    }

    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNoteViewPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNoteViewPanel,this._updateRequestedEvent);
    }

    public updateRequested(event:any, data:any):void
    {
        Debug.log("[UI] Note View Panel Update Requested");

        let note:ViewNoteFullItemData = data.note;


        this._newText = (data.note != null)?data.note.text:"";

        this.setState({
            note:note
        });
    }

    public getReference(data:any):void
    {
        this._viewContentEditor = data;
    }
    // Check if text changed.
    private handleClickOutside(event:any)
    {
        if(this.state.editing)
        {
            let scroll = 0.0;
            if(this._viewContentEditor)
            {
                scroll = this._viewContentEditor.getInstance().getScroll();
            }
            
            this.setState({editing:false, scroll:scroll});

            let data:NoteUpdateData =
            {
                id:this.state.note.id,
                text:this._newText
            }

            this.sendMainMessage(MessageChannel.updateNote, data);
        }
    }

    private onContentClick()
    {
        let scroll:number = 0.0;
        if( this._viewContent.current)
        {
            scroll = this._viewContent.current.getScroll();
        }
        
        this.setState({editing:true, scroll:scroll});
    }

    private onCodeChanged(editor:any, data:any, value:any)
    {
        this._newText = value;
    }

    public render() 
    {
        let currentPanel:any;

        if(this.state.note != null)
        {
           // Debug.logVar(this.state.note);
            if(this.state.editing)
            {
                currentPanel = <NoteViewContentEditor ref={this._getComponentReference} scroll={this.state.scroll} code = {this.state.note.text} onCodeChanged = {(editor:any, data:any, value:any)=>this.onCodeChanged(editor,data,value)} onClickOutside={(event:any)=>this.handleClickOutside(event)}/>
            }
            else
            {
                currentPanel = <NoteViewContent ref={this._viewContent} scroll={this.state.scroll} text = {this.state.note.text} store = {this.state.note.storagePath} onDoubleClick={()=>this.onContentClick()}/>
            }

            return (
                <div className="ui-note-view"> 
                    <NoteViewHeader note = {this.state.note}/>
                    {currentPanel}
                </div>
            );
        }
        else
        {
            return (
            <div className="ui-note-view"> 
                <div className="center"> 
                    No note selected
                </div> 
            </div>
            );
        }
    }
}
