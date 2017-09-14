import * as React from "react";
import {ipcRenderer} from "electron"; 

import UIManager from "../uiManager";
import NotebookStorage  from "../../notes/notebookStorage";

export default class LeftPanel extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);

        this.state =
        {
            notebooks:null
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
        let storages = data.storages.map((storage:NotebookStorage) =>
        {
            return <button type="button" className="list-group-item list-group-item-action level-2" key={storage.id}>{storage.path}</button>
        });

        this.setState({notebooks:storages});

        this.forceUpdate();
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
            </div>
        );
    }
}