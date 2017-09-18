// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../tools/debug";
import NotebookStorage  from "../../notes/notebookStorage";

// UI
import UIManager from "../uiManager";
import StorageItem from "../components/leftPanel/storageItem";




export default class LeftPanel extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            storages:null
        }  
    }
 
    public componentDidMount() 
    {
        ipcRenderer.addListener("update:LeftPanel",(event:any,data:any)=>this.updateRequested(event,data));

        UIManager.instance.sendMessage("update:LeftPanel");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener("update:LeftPanel",(event:any,data:any)=>this.updateRequested(event,data));
    }

    public updateRequested(event:any, data:any):void
    {
        let storages = data.storages.map((storageData:any) =>
        {
            let storage = NotebookStorage.createFromData(storageData);
            return  <StorageItem key = {storage.id} storage = {storage}/>
        });

        this.setState({storages:storages});
    }

    public render() 
    {

        return (
            <div className="ui-sidebar">
                <ul className="wtree">
                    <li>All Notes</li>
                    <li>Favorites</li>
                    <li>Trash</li>
                </ul>
                {this.state.storages}
            </div>
        );
    }
}