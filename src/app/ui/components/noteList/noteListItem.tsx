// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import applyOnClickOutside from 'react-onclickoutside'

// Local
import Debug from "../../../tools/debug";
import Note from "../../../notes/note";
import Message from "../../../core/message";

class NoteListItem extends React.Component<any, any> 
{
    private _textInput:any;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            editing:false,
            editingText:""
        }
    }

    private onItemClick()
    {
        let data = {noteId:this.props.note.id}

        ipcRenderer.send(Message.selectNote,data);
    }

    private onItemDelete()
    {
        let data ={noteId:this.props.note.id}

        ipcRenderer.send(Message.removeNote,data);
    }

    private edit()
    {
        this.setState({editing: true})
    }

    private editTextChanged(event:any)
    {
        this.setState({editingText: event.target.value})
    }

    public editFinished():void
    {
        this.setState({ editing: false });

        let data = 
        {
            id:this.props.note.id,
            title:this.state.editingText
        }

        ipcRenderer.send(Message.updateNote,data);
    }

    public onEditFocus(event:any):void
    {
        event.target.select();
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editing)   
        {
            Debug.log("handleClickOutside: ");
            this.editFinished();
        }
    }

    public editKeyPress(event:any):void 
    {
        if (event.key === 'Enter') 
        {
            this.editFinished();
        }
    }

    public render() 
    {
        let displayClass = "ui-note-list-item";

        let seletected:boolean = this.props.isSelected;
        
        if(this.state.editing)   
        {
            return (
                <li className={displayClass}>
                    <input 
                        className="text-area-fill" 
                        autoFocus
                        defaultValue={this.props.note.title}  
                        onChange={(event:any)=>this.editTextChanged(event)}
                        onFocus={(event:any)=>this.onEditFocus(event)}
                        onKeyPress={(event:any)=>this.editKeyPress(event)}
                    />
                </li>
            );
        }   
        else
        {
            return (
                <li className={displayClass} onClick={()=>this.onItemClick()}>
                    <span onDoubleClick={()=>this.edit()}>{this.props.note.title+" "+seletected}</span> 
                </li>
            );
        }                          
    }
}

export default applyOnClickOutside(NoteListItem);