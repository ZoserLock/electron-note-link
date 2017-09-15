import * as React from "react";
import {ipcRenderer} from "electron"; 

import ToolbarItem from "./toolbarItem"; 

export default class LeftViewport extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <div className="ui-left-viewport"> Left Viewport</div>
        );
    }

}