// Node Modules
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";


export default class ToolbarSearchBar extends UIComponent<any, any> 
{
    private _textInput:any;

    constructor(props: any)
    {
        super(props);
        this.state =
        {
            value:""
        }  
    }
    
    public focus()
    {
        this._textInput.select();
    }

    private onHandleChange(event:any) 
    {
        this.setState({value: event.target.value});
        this.sendMainMessage(MessageChannel.searchUpdated, event.target.value);
    }
    
    public render() 
    {
        return (
            <input 
                className="ui-toolbar-search"
                type="text" 
                placeholder="Search Notes"
                value={this.state.value} 
                onChange={(event:any) => this.onHandleChange(event)} 
                ref = {(ref) => this._textInput = ref}
            />
        );
    }

}