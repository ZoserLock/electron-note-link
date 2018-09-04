// Node.js
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";

export default class NavigationNotebookItem extends UIComponent<any, any>
{
    //#region Function Handles
    private handleItemClick()
    {
        let data = {notebookId:this.props.notebook.id}
        
        this.sendMainMessage(MessageChannel.selectNotebook, data);
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

        return false;
    }

    public render() 
    {
        let displayClass = "ui-sidebar-notebook-item";
        displayClass += (this.props.isSelected)? " selected":"";

        return (
            <li className={displayClass} onClick={()=>this.handleItemClick()}>
                <span></span> 
                <div className="ui-sidebar-notebook-item-title">{this.props.notebook.name}</div>
            </li>
        );
    }

}