import * as React from "react";

export default class ToolbarIcon extends React.PureComponent<any, any> 
{
    public render() 
    {
        return (
            <div className="valign-center">
                <button className="ui-toolbar-icon" onClick={this.props.onClick}>    
                    <i className="material-icons">{this.props.icon}</i> 
                </button>
            </div>
        );
    }

}