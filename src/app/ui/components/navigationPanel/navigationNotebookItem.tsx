// Node.js
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";
import Debug from "tools/debug";

export default class NavigationNotebookItem extends UIComponent<any, any>
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            dragingOver:false
        };


    }

    //#region Function Handles
    private handleItemClick()
    {
        let data = {notebookId:this.props.notebook.id}
        
        this.sendMainMessage(MessageChannel.selectNotebook, data);
    }


    
    private handleDragOver(event:React.DragEvent)
    {
        event.preventDefault();
    }

    private handleDragEnter(event:React.DragEvent)
    {
        Debug.log("handleDragEnter");
        this.setState({dragingOver:true});
    }

    private handleDragExit(event:React.DragEvent)
    {
        Debug.log("handleDragExit");
        this.setState({dragingOver:false});
    }

    private handleDropOver(event:React.DragEvent)
    {
        let noteId     = event.dataTransfer.getData("noteId");
        let notebookId = this.props.notebook.id;

        let data = 
        {
            noteId:noteId,
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.moveNote, data);
        this.setState({dragingOver:false});
    }
    //#endregion
    
    public shouldComponentUpdate(nextProps:any, nextState:any):boolean
    {
        if(nextProps.notebook.name != this.props.notebook.name)
        {
            return true;
        }

        if(nextProps.isSelected != this.props.isSelected)
        {
            return true;
        }

        if(nextState.dragingOver!= this.state.dragingOver)
        {
            return true;
        }

        return false;
    }

    public render() 
    {
        let displayClass = "ui-sidebar-notebook-item";
        displayClass += (this.props.isSelected)? " selected":"";
        displayClass +=(this.state.dragingOver)? " drag-over":"";

        return (
            <li className={displayClass} onClick={()=>this.handleItemClick()} 
                onDragEnter={(event:any)=>this.handleDragEnter(event)}
                onDragLeave={(event:any)=>this.handleDragExit(event)}
                onDragOver={(event:any)=>this.handleDragOver(event)}
                onDrop={(event:any)=>this.handleDropOver(event)}
                >
                <span></span> 
                <div className="ui-sidebar-notebook-item-title">{this.props.notebook.name}</div>
            </li>
        );
    }

}