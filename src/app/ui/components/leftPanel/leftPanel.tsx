// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

// Main
import Debug from "../../../tools/debug";

// UI
import StorageItem from "./storageItem";
import SpecialLeftItem from "./specialLeftItem";
import MessageChannel from "presenter/messageChannel";

export default class LeftPanel extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            storages:[],
            editorStatus:
            {
                mode:NoteListMode.Notebook,
                selectedNotebook:"",
                selectedNote:""
            }
        }  

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(data);
    }
 
    public componentDidMount() 
    {
        ipcRenderer.addListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(MessageChannel.updateNavigationPanel,this._updateRequestedEvent);
    }

    public updateRequested(data:any):void
    {
        let storages = data.storages.map((storage:any) =>
        {
            return (
            <ContextMenuTrigger id={"StorageItem"} key = {storage.id} attributes={{id:storage.id}}>
                <StorageItem key = {storage.id} storage = {storage} editorStatus = {data.editorStatus}/>
            </ContextMenuTrigger>
            )
        });

        this.setState({storages:storages,editorStatus:data.editorStatus});
    }

    //#region Special Notebook sets.

    private onAllNotesClick(): void 
    {
        let data =
        {
            mode:NoteListMode.All
        }

        ipcRenderer.send(MessageChannel.setNoteListMode,data);
    }

    private onStartedClick(): void 
    {
        let data = {mode:NoteListMode.Started}

        ipcRenderer.send(MessageChannel.setNoteListMode,data);
    }

    private onTrashClick(): void 
    {
        let data = {mode:NoteListMode.Trash}

        ipcRenderer.send(MessageChannel.setNoteListMode,data);
    }

    //#endregion

    //#region Notebook Context menu functions

    private handleNotebookContextMenu(e:any, data:any, target:any):void
    {
        let storageId = target.getAttribute("id");

        switch(data.action)
        {
            case "AddNotebook":
                this.AddNotebookToStorage(storageId);
            break;
            case "Remove":
                this.RemoveStorage(storageId);
            break;
        }
    }


    private AddNotebookToStorage(storageId:string)
    {
        Debug.log(" -> Adding storage to: "+storageId);
        let data =
        {
            storage:storageId
        }

        ipcRenderer.send(MessageChannel.createNotebook, data);
    }

    private RemoveStorage(storageId:string)
    {
        let data =
        {
            storage:storageId
        }

        ipcRenderer.send(MessageChannel.removeStorage, data);
    }
    //#endregion

    public render() 
    {

        let mode:number = this.state.editorStatus.mode;

        return (
            <div className="ui-sidebar">
                <ul className="ui-sidebar-header-list">
                    <SpecialLeftItem onClick={()=>this.onAllNotesClick()} name="All Notes" isSelected = {mode == NoteListMode.All}/>
                    <SpecialLeftItem onClick={()=>this.onStartedClick()} name="Started" isSelected = {mode == NoteListMode.Started}/>
                    <SpecialLeftItem onClick={()=>this.onTrashClick()} name="Trash" isSelected = {mode == NoteListMode.Trash}/>
                    <div className="ui-sidebar-header-list-separator" />
                </ul>
                <div className="ui-sidebar-list">
                    {this.state.storages}
                </div>
                <ContextMenu id={"StorageItem"}>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'AddNotebook' }}>Add Notebook</MenuItem> 
                    <MenuItem divider /> 
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Rename' }}>Rename Storage</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Remove' }}>Remove Storage</MenuItem>
                    <MenuItem onClick={(e:any, data:any, target:HTMLElement)=>{this.handleNotebookContextMenu(e, data, target)}} data={{ action: 'Delete' }}>Delete Storage</MenuItem> 
                </ContextMenu>
            </div>
        );
    }
}