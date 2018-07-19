// Global
import * as React from "react";
import {ipcRenderer} from "electron"; 

// Local
import Debug from "../../../tools/debug";
import Notebook from "../../../notes/notebook";
import Message from "../../../core/message";

export default class SpecialLeftItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        if(this.props.isSelected)
        {
            return (
                <li >
                    <a className={"ui-sidebar-header-list-item selected"}  href="#" onClick={this.props.onClick}>
                        <span></span>{this.props.name}
                    </a>
                </li>
            );
        }


        return (
            <li >
                <a className={"ui-sidebar-header-list-item"}  href="#" onClick={this.props.onClick}>
                    <span></span>{this.props.name}
                </a>
            </li>
        );
    }

}