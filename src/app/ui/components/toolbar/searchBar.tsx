
import {ipcRenderer, Input} from "electron"; 
import * as React from "react";

import Debug from "../../../tools/debug";
import Message from "../../../core/message";


export default class SearchBar extends React.Component<any, any> 
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
    

    private getClassName():string
    {
        return "ui-toolbar-item";
    }

    public focus()
    {
        this._textInput.select();
    }

    private onHandleChange(event:any) 
    {
        Debug.log("onHandleChange");
        this.setState({value: event.target.value});
        ipcRenderer.send(Message.searchUpdated, event.target.value);
    }
    
    public render() 
    {
        return (
            <input 
                type="text" 
                value={this.state.value} 
                onChange={(event:any)=>this.onHandleChange(event)} 
                ref={(ref) => this._textInput = ref}
            />
        );
    }

}