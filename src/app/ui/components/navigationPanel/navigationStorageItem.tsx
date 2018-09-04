// Node.js
import * as React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Tools
import Debug          from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent            from "ui/components/generic/uiComponent";
import NavigationNotebookItem from "ui/components/navigationPanel/navigationNotebookItem";

export default class NavigationStorageItem extends UIComponent<any,any>
{
    readonly sNotebookContextMenuId:string = "NotebookItem";

    private onAddButtonClick() 
    {
        let data =
        {
            storage:this.props.storage.id
        }

        this.sendMainMessage(MessageChannel.createNotebook, data);
    }

    private handleNotebookContextMenu(e:any, data:any, target:any):void
    {
        Debug.logVar(data);
        
        Debug.log(":: "+target.getAttribute("id"));
    }


    public render() 
    {
        Debug.logVar(this.props.storage);

        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean = this.props.editorStatus.selectedNotebook == notebook.id && this.props.editorStatus.mode == NoteListMode.Notebook;

            return  (
            <ContextMenuTrigger id={this.sNotebookContextMenuId} key = {notebook.id} attributes={{id:notebook.id}}>
                <NavigationNotebookItem  notebook={notebook} isSelected={selected} />
            </ContextMenuTrigger>
            )
        });

        let notebooks;

        if(notebookContent.length > 0)
        {
            notebooks = 
            (  
                <ul className="ui-sidebar-storage-item-notebooks">
                    {notebookContent}
                </ul>
            );
        }

        return (
            <div>
                <div className="ui-sidebar-storage-item"> 
                    <span>{this.props.storage.name}</span> 
                    <div className="ui-sidebar-storage-item-button-container">
                        <button className="ui-sidebar-storage-item-button" onClick={()=>this.onAddButtonClick()}></button>
                    </div>
                </div>
                {notebooks}    
                <ContextMenu id={this.sNotebookContextMenuId}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Add Note' }}>Add Note</MenuItem> 
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Rename' }}>Rename Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Export' }}>Export Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Delete' }}>Delete Notebook</MenuItem> 
                </ContextMenu>
            </div>

        );
    }

}