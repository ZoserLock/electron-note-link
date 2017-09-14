import * as React from 'react';
import {ipcRenderer} from 'electron'; 

import ToolbarItem from './toolbarItem'; 

export default class Toolbar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public onNewNoteClick()
    {
        console.log("new Note Click");
    }

    public render() 
    {
        return (
            <header className="ui-toolbar">
                <button className="ui-toolbar-item">1</button>
                <button className="ui-toolbar-item">2</button>
                <button className="ui-toolbar-item">3</button>
            </header>
        );
    }

}