import * as React from "react";

export default class WindowbarItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }
    
    private getClassName():string
    {
        return "ui-windowbar-item ui-windowbar-item-close";
    }

    public render() 
    {
        return (
            <a className={this.getClassName()} onClick={this.props.onClick}>{this.props.name}</a>
        );
    }

}