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
        let displayClass = (this.props.isSelected)? "selected text-unselect": "text-unselect";
        displayClass += " ui-sidebar-notebook-item";

        Debug.log("Is Selected: "+this.props.name +" : "+this.props.isSelected);

        return (
            <li className={displayClass} >
                <span onClick={()=>this.props.onClick()}>{this.props.name +" "+ this.props.isSelected}</span> 
            </li>
        );
    }

}