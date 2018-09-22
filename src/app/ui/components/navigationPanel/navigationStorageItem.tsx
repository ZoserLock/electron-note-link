// Node.js
import * as React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Tools
import Debug          from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent            from "ui/components/generic/uiComponent";
import EditableText           from "ui/components/generic/editableText";
import NavigationNotebookItem from "ui/components/navigationPanel/navigationNotebookItem";

interface NavigationStorageItemProps
{
    readonly storage:ViewStorageItemData;
    readonly status:ViewCoreData;
}

export default class NavigationStorageItem extends UIComponent<NavigationStorageItemProps, any>
{
    readonly sNotebookContextMenuId:string = "NotebookItem";

    private onAddButtonClick() 
    {
        let data =
        {
            storageId:this.props.storage.id
        }

        this.sendMainMessage(MessageChannel.createNotebook, data);
    }

    private handleNotebookContextMenu(e:any, data:any, target:any):void
    {
        Debug.logVar(data);
        
        Debug.log(":: "+target.getAttribute("id"));
    }

    private handleStorageNameEdit(newText:string):void
    {
        let data:StorageUpdateData =
        {
            id:this.props.storage.id,
            name:newText
        }

        this.sendMainMessage(MessageChannel.updateStorage, data);
    }

    public render() 
    {
        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean = this.props.status.selectedNotebook == notebook.id && this.props.status.noteListMode == NoteListMode.Notebook;

            return  (
            <ContextMenuTrigger id={this.sNotebookContextMenuId} key = {notebook.id} attributes={{id:notebook.id}}>
                <NavigationNotebookItem  notebook={notebook} isSelected={selected} />
            </ContextMenuTrigger>
            )
        });

        let notebookList;

        if(notebookContent.length > 0)
        {
            notebookList = 
            (  
                <ul className="ui-sidebar-storage-item-notebooks">
                    {notebookContent}
                </ul>
            );
        }

        return (
            <div>
                <div className="ui-sidebar-storage-item"> 
                    <div className="ui-sidebar-storage-item-container"> 
                        <EditableText 
                            allowDoubleClick = {true}
                            isSelected ={true}
                            value = {this.props.storage.name} 
                            onEditFinished={(text:string)=>this.handleStorageNameEdit(text)}
                        />
                    </div>
                    <div className="ui-sidebar-storage-item-button-container">
                        <button className="ui-sidebar-storage-item-button" onClick={()=>this.onAddButtonClick()}></button>
                    </div>
                </div>
                {notebookList}    
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