// Node.js
import * as React from "react";
import { List, AutoSizer } from 'react-virtualized'
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";

// Presenter
import MessageChannel from "presenter/messageChannel";

// Tools
import Debug from "tools/debug";

// UI
import NoteListItem from "ui/components/noteListPanel/noteListItem";
import UIComponent from "ui/components/generic/uiComponent";

export default class NoteListContent extends UIComponent<any, any> 
{
    private _rowRenderer:any;

    private readonly sContextMenuCopyLink:string    = "CopyLink"; 
    private readonly sContextMenuViewSource:string  = "ViewSource"; 
    private readonly sContextMenuDuplicate:string   = "Duplicate"; 
    private readonly sContextMenuRename:string      = "Rename"; 
    private readonly sContextMenuDelete:string      = "Delete"; 

    constructor(props: any)
    {
        super(props);

        this._rowRenderer = ({index, isScrolling, key, style}:any)=>this.rowRenderer({index, isScrolling, key, style});
    }

    //#region Handle Context Menu Functions
    private handleNoteContextMenu(e:any, data:any, target:any):void
    {
        Debug.log("handleNoteContextMenu");
        let noteId = target.getAttribute("id");

        switch(data.action)
        {
            case this.sContextMenuCopyLink:
                this.createNoteLink(noteId);
            break;
            case this.sContextMenuViewSource:
                this.viewNoteSource(noteId);
            break;
            case this.sContextMenuDuplicate:
                this.duplicateNote(noteId);
            break;
            case this.sContextMenuRename:
                this.renameNote(noteId);
            break; 
            case this.sContextMenuDelete:
                this.deleteNote(noteId);
            break; 
        }
    }

    public createNoteLink(noteId:string):void
    {
        let data = 
        {
            noteId:noteId
        }

        this.sendMainMessage(MessageChannel.createNoteLink, data);
    }

    public viewNoteSource(noteId:string):void
    {
        let data = 
        {
            noteId:noteId
        }

        this.sendMainMessage(MessageChannel.viewNoteSource, data);
    }

    public duplicateNote(noteId:string):void
    {
        let data = 
        {
            noteId:noteId
        }

        this.sendMainMessage(MessageChannel.duplicateNote, data);
    }

    public renameNote(noteId:string):void
    {
        let data = 
        {
            noteId:noteId
        }

        this.sendMainMessage(MessageChannel.renameNote, data);
    }

    public deleteNote(noteId:string):void
    {
        let data = 
        {
            noteId:noteId
        }

        this.sendMainMessage(MessageChannel.deleteNote, data);
    }

    //#endregion

    public render() 
    {
        if(this.props.notes.length == 0)
        {
            return (
                <div className="ui-note-list-content"> 
                    <div className="ui-note-list-empty-item"> 
                        <div>No matching notes found</div>
                    </div>
                </div>
            )
        }

        return (
            <div className="ui-note-list-content"> 
                <AutoSizer>
                {({ height, width }) => (
                    <List 
                       
                        width={width}
                        height={height}
                        rowCount ={this.props.notes.length}
                        rowHeight={80} 
                        rowRenderer={this._rowRenderer}  
                        selectedNote= {this.props.selectedNote}
                        forceUpdate= {this.props.forceUpdate}
                        />
                    )}
                </AutoSizer>
                <ContextMenu id={"NoteItem"}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: this.sContextMenuCopyLink }}>Copy Link</MenuItem> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: this.sContextMenuViewSource }}>View Source</MenuItem>
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: this.sContextMenuDuplicate }}>Duplicate Note</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: this.sContextMenuRename }}>Rename Note</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: this.sContextMenuDelete }}>Delete Note</MenuItem> 
                </ContextMenu>
            </div>
            
        );    
  
    }

    private rowRenderer({index, isScrolling, key, style}:any)
    {
        let note = this.props.notes[index];

        return (
            <div key = {key} style = {style}>
            <ContextMenuTrigger id={"NoteItem"} key = {note.id} attributes={{id:note.id}}>
                <NoteListItem note = {note} isSelected={this.props.selectedNote == note.id}/>
            </ContextMenuTrigger>
            </div>
        );
    }

}