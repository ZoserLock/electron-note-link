import * as React from "react";

export default class WindowbarItem extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }
    
    private getClassName():string
    {
        let className = "ui-windowbar-item ";
        
        switch(this.props.type)
        {
            case "close":
                className += "ui-windowbar-item-close";
            break;
            case "minimize":
                className += "ui-windowbar-item-minimize";
            break;
            case "maximize":
                className += "ui-windowbar-item-maximize";
            break;
            case "options":
                className += "ui-windowbar-item-options";
            break;
        }
        
        return className ;
    }

    public render() 
    {
        return (
            <a className={this.getClassName()} onClick={this.props.onClick}>{this.props.name}</a>
        );
    }

}