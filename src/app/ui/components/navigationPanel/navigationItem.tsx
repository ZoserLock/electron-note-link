// Node.js
import * as React from "react";

export default class NavigationItem extends React.PureComponent<any,any>
{
    readonly sItemStyle:string = "ui-sidebar-header-list-item ";

    public render()
    {
        return (
            <li >
                <a className = {this.sItemStyle + (this.props.isSelected?"selected":"")}  href="#" onClick = {this.props.onClick}>
                    <span></span>{this.props.name}
                </a>
            </li>
        );
    }
}