// Node.js
import * as React from "react";
import { List, AutoSizer } from 'react-virtualized'
import { ContextMenuTrigger, ContextMenu, MenuItem } from "react-contextmenu";

// Tools
import Debug from "tools/debug";

// UI
import NoteListItem from "ui/components/noteListPanel/noteListItem";

export default class NoteListContent extends React.Component<any, any> 
{
    private _rowRenderer:any;
   
    constructor(props: any)
    {
        super(props);

        this._rowRenderer = ({index, isScrolling, key, style}:any)=>this.rowRenderer({index, isScrolling, key, style});
    }

    //#region Handle Context Menu Functions
    private handleNoteContextMenu(e:any, data:any, target:any):void
    {

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
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: 'Copy Link' }}>Copy Link</MenuItem> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: 'View Source' }}>View Source</MenuItem>
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: 'Dumplicate' }}>Duplicate Note</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: 'Rename' }}>Rename Note</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNoteContextMenu(e, data, target)}} data={{ action: 'Delete' }}>Delete Note</MenuItem> 
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