import * as React from "react";
import applyOnClickOutside from 'react-onclickoutside'

import Debug from "../../../tools/debug";

class EditableText extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        
        this.state =
        {
            editing:false,
            editingText:""
        }
    }
    
    public edit()
    {
        this.setState({editingText: this.props.value, editing: true})
    }

    private editTextChanged(event:any)
    {
        this.setState({editingText: event.target.value})
    }

    private editFinished():void
    {
        this.setState({ editing: false });
        this.props.onEditFinished(this.state.editingText)
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editing)   
        {
            this.editFinished();
        }
    }

    public editKeyPress(event:any):void 
    {
        if (event.key === "Enter") 
        {
            this.editFinished();
        }
    }

    public render() 
    {
        if(this.state.editing)   
        {
            return (
                <div>
                    <input 
                        autoFocus
                        defaultValue={this.props.value}  
                        onChange={(event:any)=>this.editTextChanged(event)}
                        onFocus={(event:any)=>event.target.select()}
                        onKeyPress={(event:any)=>this.editKeyPress(event)}
                    />
                </div>
            );
        }   
        else
        {
            return (
                <div onClick={this.props.onClick} onDoubleClick={()=>this.edit()}>
                    <span>{this.props.value}</span> 
                 </div>
            );
        }                          
    }
}

export default applyOnClickOutside(EditableText);