// Node.js
import * as React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Tools
import Debug from "tools/debug";

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
    // Notebook Context menu options
    private readonly sContextMenuNewNote:string     = "AddNote"; 
    private readonly sContextMenuViewSource:string  = "ViewSource"; 
    private readonly sContextMenuRename:string      = "Rename"; 
    private readonly sContextMenuExport:string      = "Export"; 
    private readonly sContextMenuDelete:string      = "Delete"; 

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
        let notebookId = target.getAttribute("id");

        switch(data.action)
        {
            case this.sContextMenuNewNote:
                this.createNote(notebookId);
            break;
            case this.sContextMenuViewSource:
                this.viewSource(notebookId);
        break;
            case this.sContextMenuRename:
                this.renameNotebook(notebookId);
            break;
            case this.sContextMenuExport:
                this.exportNotebook(notebookId);
            break; 
            case this.sContextMenuDelete:
                this.deleteNotebook(notebookId);
            break; 
        }
    }

    private createNote(notebookId:string)
    {
        let data = 
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.createNote, data);
    }

    private viewSource(notebookId:string)
    {
        let data = 
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.viewNotebookSource, data);
    }

    private renameNotebook(notebookId:string)
    {
        let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.renameNotebook, data);
    }

    private exportNotebook(notebookId:string)
    {
        Debug.logError("Implement Me!");
        /*let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.removeStorage, data);*/
    }

    private deleteNotebook(notebookId:string)
    {
        let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.deleteNotebook, data);
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
        let contextMenuId    = this.props.storage.id;
        let selectedNotebook = this.props.status.selectedNotebook;
        let noteListMode     = this.props.status.noteListMode;

        let notebookContent = this.props.storage.notebooks.map((notebook:any) =>
        {
            let selected:boolean =  selectedNotebook == notebook.id && noteListMode == NoteListMode.Notebook;

            return  (
            <ContextMenuTrigger id={contextMenuId} key = {notebook.id} attributes={{id:notebook.id}}>
                <NavigationNotebookItem  notebook={notebook} isSelected={selected} id={notebook.id} />
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
            <div id = {this.props.storage.id}>
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
                <ContextMenu id={this.props.storage.id}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuNewNote }}>Add Note</MenuItem> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuViewSource }}>View Source</MenuItem>
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuRename }}>Rename Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuDelete }}>Delete Notebook</MenuItem> 
                </ContextMenu>
            </div>

        );
    }

}