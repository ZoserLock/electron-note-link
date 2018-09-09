// Node Modules
import * as React from "react";
import applyOnClickOutside from 'react-onclickoutside'

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
    note:ViewNoteItemData;
    editing:boolean;
}

class NoteViewPanel extends UIComponent<any, NavigationPanelState> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    private _newText:string = "";

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            note:null,
            editing:false
        }

        this._updateRequestedEvent = (event:any,data:any) => this.updateRequested(event,data);
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

        let note:ViewNoteItemData = data.note;

        Debug.logVar(data);

        this._newText = (data.note != null)?data.note.text:"";

        this.setState({
            note:note
        });
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editing)
        {
            this.setState({editing:false});

            let data:NoteUpdateData =
            {
                id:this.state.note.id,
                text:this._newText
            }

            this.sendMainMessage(MessageChannel.updateNote, data);
            event.stopImmediatePropagation();
        }
    }

    private onContentClick()
    {
        this.setState({editing:true});
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
            Debug.logVar(this.state.note);
            if(this.state.editing)
            {
                currentPanel = <NoteViewContentEditor code = {this.state.note.text} onCodeChanged = {(editor:any, data:any, value:any)=>this.onCodeChanged(editor,data,value)}/>
            }
            else
            {
                currentPanel = <NoteViewContent text = {this.state.note.text} onDoubleClick={()=>this.onContentClick()}/>
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

export default applyOnClickOutside(NoteViewPanel);
