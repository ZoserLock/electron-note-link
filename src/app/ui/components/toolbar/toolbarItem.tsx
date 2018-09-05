import * as React from "react";

export default class ToolbarItem extends React.PureComponent<any, any> 
{
    public render() 
    {
        return (
            <button className={"ui-toolbar-item"} onClick={this.props.onClick}>{this.props.name}</button>
        );
    }

}