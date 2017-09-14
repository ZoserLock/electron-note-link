import * as React from 'react';
import {ipcRenderer} from 'electron'; 

import ToolbarItem from './toolbarItem'; 

export default class RightViewport extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <div className="ui-right-viewport"> Right Viewport</div>
        );
    }

}