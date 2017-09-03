import * as React from 'react';
import {ipcRenderer} from 'electron'; 

import UIManager from "../../core/uiManager";

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
        ipcRenderer.addListener('update:LeftPanel',(event:any,data:any)=>this.updateRequested(event,data));

        UIManager.instance.sendMessage("update:LeftPanel");
    }

    public componentWillUnmount()
    {
        ipcRenderer.removeListener('update:LeftPanel',(event:any,data:any)=>this.updateRequested(event,data));
    }

    public updateRequested(event:any,data:any):void
    {
        let notebooks = data.notebooks.map((notebook:any) =>
        {
            if(notebook.name === data.current)
            {
                return <button type="button" className="list-group-item list-group-item-action level-2 active" key={notebook.name}>{notebook.name}</button>
            }
        
            return <button type="button" className="list-group-item list-group-item-action level-2" key={notebook.name}>{notebook.name}</button>
            
        });

        this.setState({notebooks:notebooks});

        this.forceUpdate();
    }

    public render() 
    {
        return (
            <div className="list-group col-sm-2 sidebar">
                <button type="button" className="list-group-item list-group-item-action">Notebooks</button>
                {this.state.notebooks}
                <button type="button" className="list-group-item list-group-item-action">Favs</button>
                <button type="button" className="list-group-item list-group-item-action">Trash</button>
            </div>
        );
    }
}