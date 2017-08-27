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
            <nav className="navbar navbar-expand navbar-dark bg-dark ">
            <ul className="navbar-nav mr-auto">
                <ToolbarItem onClick={()=>this.onNewNoteClick()}>New Note</ToolbarItem>
            </ul>
                <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-sm-0" type="submit">Search</button>
                </form>
            </nav>
        );
    }

}