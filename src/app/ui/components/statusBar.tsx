import * as React from 'react';
import {ipcRenderer} from 'electron'; 

import ToolbarItem from './toolbarItem'; 

export default class Statusbar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <footer className="ui-statusbar"></footer>
        );
    }

}