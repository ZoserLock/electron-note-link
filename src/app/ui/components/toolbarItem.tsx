import * as React from "react";

export default class ToolbarItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }
    
    private getClassName():string
    {
        return "ui-toolbar-item";
    }

    public render() 
    {
        return (
            <button className={this.getClassName()} onClick={this.props.onClick}>{this.props.name}</button>
        );
    }

}