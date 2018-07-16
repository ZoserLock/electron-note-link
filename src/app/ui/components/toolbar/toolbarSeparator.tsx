import * as React from "react";

export default class ToolbarSeparator extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    public render() 
    {
        return (
            <div className="ui-toolbar-separator"></div>
        );
    }

}