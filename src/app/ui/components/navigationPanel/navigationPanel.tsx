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
import { debug } from "util";

interface NavigationPanelState
{
    storages:ViewStorageItemData[];
    status:ViewCoreData;
}

export default class NavigationPanel extends UIComponent<any, NavigationPanelState>
{
    // Context Menu Id
    readonly sStorageContextMenuId:string = "StorageItemContextMenu";

    // Context menu options
    private readonly sContextMenuNewNotebook:string = "AddNotebook"; 

    private readonly sContextMenuRename:string      = "Rename"; 
    private readonly sContextMenuRemove:string      = "Remove"; 
    private readonly sContextMenuDelete:string      = "Delete"; 
    
    // Event Listeners
    private _updateRequestedEvent: (event: any, data: any) => void;
    private _focusNotebook: (event: any, data: any) => void;
    private _focusStorage: (event: any, data: any) => void;

    private _contentScrollRef:React.RefObject<HTMLDivElement>;

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
        this._focusNotebook = (event:any, data:any) => this.focusNotebook(data);
        this._focusStorage = (event:any, data:any) => this.focusStorage(data);

        this._contentScrollRef = React.createRef<HTMLDivElement>();
    }
 
    public componentDidMount() 
    {
        this.registerMainListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
        this.registerMainListener(MessageChannel.focusNotebook,this._focusNotebook);
        this.registerMainListener(MessageChannel.focusStorage,this._focusStorage);
    }

    public componentWillUnmount()
    {
        this.unregisterMainListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
        this.unregisterMainListener(MessageChannel.focusNotebook,this._focusNotebook);
        this.unregisterMainListener(MessageChannel.focusStorage,this._focusStorage);
    }

    public updateRequested(data:any):void
    {
        Debug.log("[UI] NavigationPanel Update Requested");

        this.setState({
            storages:data.storages,
            status:data.status
        });
    }

    // TODO: Find another way to reference an object.
    public focusStorage(data:any):void
    {
        Debug.log("[UI] NavigationPanel Focus Storage Requested");
        if(data != null && data.storageId != undefined)
        {
            Debug.log("[UI] scrollToElement: #"+data.storageId);
            if( this._contentScrollRef.current)
            {
                var element:HTMLElement = document.getElementById(data.storageId);

                if(element)
                {
                    this._contentScrollRef.current.scrollTop = element.offsetTop - this._contentScrollRef.current.offsetTop;
                }
            }
            
        }
    }

    // TODO: Find another way to reference an object.
    public focusNotebook(data:any):void
    {
        Debug.log("[UI] NavigationPanel Focus Notebook Requested");
        if(data != null && data.notebookId != undefined)
        {
            Debug.log("[UI] scrollToElement: #"+data.notebookId);
            if( this._contentScrollRef.current)
            {
                var element:HTMLElement = document.getElementById(data.notebookId);

                if(element)
                {
                    this._contentScrollRef.current.scrollTop = element.offsetTop - this._contentScrollRef.current.offsetTop;
                }
            }
        }
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
            case this.sContextMenuNewNotebook:
                this.CreateNotebook(storageId);
            break;
            case this.sContextMenuRename:
                this.RenameStorage(storageId);
            break;
            case this.sContextMenuRemove:
                this.RemoveStorage(storageId);
            break;
            case this.sContextMenuDelete:
                this.DeleteStorage(storageId);
            break; 
        }
    }


    private CreateNotebook(storageId:string)
    {
        let data = 
        {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.createNotebook, data);
    }

    private RenameStorage(storageId:string)
    {
        let data =
        {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.renameStorage, data);
    }

    private RemoveStorage(storageId:string)
    {
        let data =
        {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.removeStorage, data);
    }

    private DeleteStorage(storageId:string)
    {
        let data =
        {
            storageId:storageId
        }

        this.sendMainMessage(MessageChannel.deleteStorage, data);
    }

    //#endregion

    public render() 
    {
        let mode:number = this.state.status.noteListMode;
        let contextMenuId = this.sStorageContextMenuId;

        let storageList = this.state.storages.map((storage:any,index:number) =>
        {
            return (
            <ContextMenuTrigger id={contextMenuId} key = {storage.id} attributes={{id:storage.id}}>
                <NavigationStorageItem storage = {storage} status = {this.state.status}/>
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
                <div ref={this._contentScrollRef} className = "ui-sidebar-list">
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