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
    private readonly sContextMenuNewNote:string = "AddNote"; 
    private readonly sContextMenuRename:string  = "Rename"; 
    private readonly sContextMenuExport:string  = "Export"; 
    private readonly sContextMenuDelete:string  = "Delete"; 

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
        Debug.log("Handle Notebook Context Menu X");
        let notebookId = target.getAttribute("id");
        Debug.log("Handle Notebook Context Menu: "+notebookId);

        switch(data.action)
        {
            case this.sContextMenuNewNote:
                this.CreateNote(notebookId);
            break;
            case this.sContextMenuRename:
                this.RenameNotebook(notebookId);
            break;
            case this.sContextMenuExport:
                this.ExportNotebook(notebookId);
            break; 
            case this.sContextMenuDelete:
                this.DeleteNotebook(notebookId);
            break; 
        }
    }

    private CreateNote(notebookId:string)
    {
        Debug.log("Creating notebook on: "+notebookId);
        let data = 
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.createNote, data);
    }

    private RenameNotebook(notebookId:string)
    {
        let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.removeStorage, data);
    }

    private ExportNotebook(notebookId:string)
    {
        let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.deleteStorage, data);
    }

    private DeleteNotebook(notebookId:string)
    {
        let data =
        {
            notebookId:notebookId
        }

        this.sendMainMessage(MessageChannel.deleteStorage, data);
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
                <ContextMenu id={this.props.storage.id}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuNewNote }}>Add Note</MenuItem> 
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuRename }}>Rename Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuExport }}>Export Notebook</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuDelete }}>Delete Notebook</MenuItem> 
                </ContextMenu>
            </div>

        );
    }

}