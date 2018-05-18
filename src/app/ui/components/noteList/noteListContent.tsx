// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";

// UI
import NoteListItem from "./noteListItem";
import { List, AutoSizer } from 'react-virtualized'

export default class NoteListContent extends React.Component<any, any> 
{
    private _rowRenderer:any;
   
    constructor(props: any)
    {
        super(props);

        this._rowRenderer = ({index, isScrolling, key, style}:any)=>this.rowRenderer({index, isScrolling, key, style});

    }


    public render() 
    {
        return (
            <div className="ui-note-list-content"> 
                <AutoSizer>
                {({ height, width }) => (
                    <List 
                       
                        width={width}
                        height={height}
                        rowCount ={this.props.notes.length}
                        rowHeight={30} 
                        rowRenderer={this._rowRenderer}  
                        selectedNote= {this.props.selectedNote}
                        forceUpdate= {this.props.forceUpdate}
                        />
                    )}
                </AutoSizer>
            </div>
        );    
  
    }

    private rowRenderer({index, isScrolling, key, style}:any)
    {
        let note = this.props.notes[index];

        return (
            <div key = {key} style = {style}>
                <NoteListItem note = {note} isSelected={this.props.selectedNote == note.id}/>
            </div>
        );
    }

}