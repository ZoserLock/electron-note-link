
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {ipcRenderer} from 'electron'; 

import Toolbar from './app/ui/components/toolbar';
import LeftPanel from './app/ui/components/leftPanel'
import UIManager from './app/core/uiManager';

class ApplicationWindow extends React.Component<any, any> 
{
    constructor()
    {
        super();

        this.state = 
        {
            name:"Zoser Default",
            toolbar:null,
        };

        ipcRenderer.on('data',(event:any,data:any)=>this.dataReceived(event,data));
    }

    public dataReceived(event:any,data:any):void
    {
        console.log(data.name);

        this.setState({name:data.name});
    }

    
    render() 
    {
        return(
        <div>
            <Toolbar/>
            <div className="container-fluid">
                <div className="row">
                    <LeftPanel/>
                    <main className="col-sm-10" role="main">
                    </main>
                </div>
            </div>
        </div>
        );
    }
}

UIManager.initialize();

ReactDOM.render(
    <ApplicationWindow/>
    ,document.getElementById('root')
);