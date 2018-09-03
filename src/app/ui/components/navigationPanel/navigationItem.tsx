// Node.js
import * as React from "react";

export default class NavigationItem extends React.PureComponent<any,any>
{
    private _itemStyle:string = "ui-sidebar-header-list-item ";

    public render()
    {
        return (
            <li >
                <a className={this._itemStyle + (this.props.isSelected?"selected":"")}  href="#" onClick={this.props.onClick}>
                    <span></span>{this.props.name}
                </a>
            </li>
        );
    }

}