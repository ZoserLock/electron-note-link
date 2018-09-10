// Global
import * as React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Tools
import Debug          from "tools/debug";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import NavigationStorageItem from "ui/components/navigationPanel/navigationStorageItem"
import NavigationItem        from "ui/components/navigationPanel/navigationItem"
import UIComponent from "../generic/uiComponent";

interface NavigationPanelState
{
    storages:ViewStorageItemData[];
    status:ViewCoreData;
}

export default class NavigationPanel extends UIComponent<any, NavigationPanelState>
{
    // Context Menu Id
    readonly sStorageContextMenuId:string = "StorageItem";

    // Context menu options
    private readonly sContextMenuNewNotebook:string = "AddNotebook"; 
    private readonly sContextMenuRename:string      = "Rename"; 
    private readonly sContextMenuRemove:string      = "Remove"; 
    private readonly sContextMenuDelete:string      = "Delete"; 
    
    // Event Listeners
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state ={
            storages:[],
            status:{
                noteListMode:NoteListMode.Notebook,
                selectedNotebook:"",
                selectedNote:"",
                searchPhrase:""
            }
        }  

        this._updateRequestedEvent = (event:any, data:any) => this.updateRequested(data);
    }
 
    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
    }

    public updateRequested(data:any):void
    {
        Debug.log("[UI] NavigationPanel Update Requested");

        this.setState({
            storages:data.storages,
            status:data.status
        });
    }

    //#region Navigation Item Handle Functions.

    private handleAllNotesClick(): void 
    {
        let data = {mode:NoteListMode.All}

        this.sendMainMessage(MessageChannel.setNoteListMode, data);
    }

    private handleStartedNotesClick(): void 
    {
        let data = {mode:NoteListMode.Started}

        this.sendMainMessage(MessageChannel.setNoteListMode, data);
    }

    private handleTrashNotesClick(): void 
    {
        let data = {mode:NoteListMode.Trash}

        this.sendMainMessage(MessageChannel.setNoteListMode,data);
    }

    //#endregion

    //#region Notebook Context Menu Handle Functions.

    private handleNotebookContextMenu(e:any, data:any, target:any):void
    {
        let storageId = target.getAttribute("id");

        switch(data.action)
        {
            case "AddNotebook":
                this.CreateNotebook(storageId);
            break;
            case "Remove":
                this.RemoveStorage(storageId);
            break;
        }
    }


    private CreateNotebook(storageId:string)
    {
        let data = {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.createNotebook, data);
    }

    private RemoveStorage(storageId:string)
    {
        let data =
        {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.removeStorage, data);
    }
    //#endregion

    public render() 
    {
        let mode:number = this.state.status.noteListMode;

        let storageList = this.state.storages.map((storage:any) =>
        {
            return (
            <ContextMenuTrigger id={this.sStorageContextMenuId} key = {storage.id} attributes={{id:storage.id}}>
                <NavigationStorageItem key = {storage.id} storage = {storage} status = {this.state.status}/>
            </ContextMenuTrigger>
            )
        });

        return (
            <div className = "ui-sidebar">
                <ul className = "ui-sidebar-header-list">
                    <NavigationItem onClick={()=>this.handleAllNotesClick()}     name = "All Notes" isSelected = {mode == NoteListMode.All}/>
                    <NavigationItem onClick={()=>this.handleStartedNotesClick()} name = "Started"   isSelected = {mode == NoteListMode.Started}/>
                    <NavigationItem onClick={()=>this.handleTrashNotesClick()}   name = "Trash"     isSelected = {mode == NoteListMode.Trash}/>
                    <div className="ui-sidebar-header-list-separator" />
                </ul>
                <div className = "ui-sidebar-list">
                    {storageList}
                </div>
                <ContextMenu id = {this.sStorageContextMenuId}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuNewNotebook }}>Add Notebook</MenuItem> 
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuRename }}>Rename Storage</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuRemove }}>Remove Storage</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: this.sContextMenuDelete }}>Delete Storage</MenuItem> 
                </ContextMenu>
            </div>
        );
    }
}