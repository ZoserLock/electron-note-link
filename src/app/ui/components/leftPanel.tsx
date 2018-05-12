// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Main
import Debug from "../../tools/debug";
import { NoteListMode } from "../../core/editor";

// UI
import StorageItem from "../components/leftPanel/storageItem";
import SpecialLeftItem from "../components/leftPanel/specialLeftItem";
import Message from "../../core/message";

export default class LeftPanel extends React.Component<any, any> 
{
    private _updateRequestedEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            storages:null,
            mode:NoteListMode.Notebook
        }  

        this._updateRequestedEvent = (event:any,data:any)=>this.updateRequested(event,data);
    }
 
    public componentDidMount() 
    {
        ipcRenderer.addListener(Message.updateLeftPanel,this._updateRequestedEvent);

        ipcRenderer.send(Message.updateLeftPanel);
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener(Message.updateLeftPanel,this._updateRequestedEvent);
    }

    public updateRequested(event:any, data:any):void
    {
        let storages = data.storages.map((storage:any) =>
        {
            return  <StorageItem key = {storage.id} storage = {storage}/>
        });

        this.setState({storages:storages, mode:data.mode});
    }

    private onAllNotesClick(): void 
    {
        Debug.log("onAllNotesClick");
        let data =
        {
            mode:NoteListMode.All
        }

        ipcRenderer.send(Message.setNoteListMode,data);
    }

    private onStartedClick(): void 
    {
        Debug.log("onStartedClick");
    }

    private onTrashClick(): void 
    {
        Debug.log("onTrashClick");
    }

    public render() 
    {

        Debug.log("Selected: "+this.state.mode);

        return (
            <div className="ui-sidebar">
                <ul className="wtree">
                <SpecialLeftItem onClick={()=>this.onAllNotesClick()} name="All Notes" isSelected = {this.state.mode == NoteListMode.All}/>
                <SpecialLeftItem onClick={()=>this.onStartedClick()} name="Started" isSelected = {this.state.mode == NoteListMode.Started}/>
                <SpecialLeftItem onClick={()=>this.onTrashClick()} name="Trash" isSelected = {this.state.mode == NoteListMode.Trash}/>
                </ul>
                {this.state.storages}
            </div>
        );
    }
}