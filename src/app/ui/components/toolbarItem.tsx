import * as React from "react";

export default class ToolbarItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }
    
    public render() 
    {
        return (

            <li className="nav-item hidden-md">
                <a className="nav-link" href="#" onClick={this.props.onClick}>{this.props.children}</a>
            </li>
        );
    }

}