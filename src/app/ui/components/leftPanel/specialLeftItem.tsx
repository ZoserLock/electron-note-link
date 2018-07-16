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
        let displayClass = "ui-sidebar-header-list-item";

        var dynamicStyle = {
            background: 'white',
          };

        return (
            <li >
                <a className={displayClass}  href="#" onClick={this.props.onClick}>
                    <span style={dynamicStyle}></span>{this.props.name}
                </a>
            </li>
        );
    }

}