// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Main
import Debug from "../../../tools/debug";

// UI
import StorageItem from "./storageItem";
import SpecialLeftItem from "./specialLeftItem";
import Message from "../../../core/message";

import { NoteListMode } from "../../../../enums";

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
        ipcRenderer.addListener(Message.updateLeftPanel,this._updateRequestedEvent);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(Message.updateLeftPanel,this._updateRequestedEvent);
    }

    public updateRequested(data:any):void
    {
        let storages = data.storages.map((storage:any) =>
        {
            return  <StorageItem key = {storage.id} storage = {storage} editorStatus = {data.editorStatus}/>
        });

        this.setState({storages:storages,editorStatus:data.editorStatus});
    }

    private onAllNotesClick(): void 
    {
        let data =
        {
            mode:NoteListMode.All
        }

        ipcRenderer.send(Message.setNoteListMode,data);
    }

    private onStartedClick(): void 
    {
        let data = {mode:NoteListMode.Started}

        ipcRenderer.send(Message.setNoteListMode,data);
    }

    private onTrashClick(): void 
    {
        let data = {mode:NoteListMode.Trash}

        ipcRenderer.send(Message.setNoteListMode,data);
    }

    private onSearchClick(): void 
    {
        let data = {mode:NoteListMode.Search};

        ipcRenderer.send(Message.setNoteListMode,data);
    }

    public render() 
    {

        let mode:number = this.state.editorStatus.mode;

        return (
            <div className="ui-sidebar">
                <ul className="ui-sidebar-header-list">
                    <SpecialLeftItem onClick={()=>this.onAllNotesClick()} name="All Notes" isSelected = {mode == NoteListMode.All}/>
                    <SpecialLeftItem onClick={()=>this.onStartedClick()} name="Started" isSelected = {mode == NoteListMode.Started}/>
                    <SpecialLeftItem onClick={()=>this.onTrashClick()} name="Trash" isSelected = {mode == NoteListMode.Trash}/>
                </ul>
                <div className="ui-sidebar-list">
                    {this.state.storages}
                </div>
            </div>
        );
    }
}