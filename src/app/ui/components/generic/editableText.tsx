// Node Modules
import * as React from "react";
import applyOnClickOutside from 'react-onclickoutside'
import Debug from "tools/debug";

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
    
    public edit():void
    {
        this.setState({editingText: this.props.value, editing: true})
    }

    private handleDoubleClick():void
    {
        if(this.props.allowDoubleClick)
        {
            this.edit();
        }
    }

    //#region Event Handling Functions
    private handleEditChanged(event:any)
    {
        this.setState({editingText: event.target.value})
    }

    private handleEditFinished():void
    {
        this.setState({ editing: false });
        this.props.onEditFinished(this.state.editingText)
    }

    private handleClickOutside(event:any)
    {
        if(this.state.editing)   
        {
            this.handleEditFinished();
        }
    }

    public handleKeyPress(event:any):void 
    {
        if (event.key === "Enter") 
        {
            this.handleEditFinished();
        }
    }
    //#endregion

    public render() 
    {
/*        editContClass = "ui-note-list-item-title-edit-container"
                            editClass ="ui-note-list-item-title-edit"*/

        if(this.state.editing)   
        {
            return (
                <div className ={"editor"}>
                    <input 
                        autoFocus
                        defaultValue={this.props.value}  
                        onChange={(event:any)=>this.handleEditChanged(event)}
                        onFocus={(event:any)=>event.target.select()}
                        onKeyPress={(event:any)=>this.handleKeyPress(event)}
                    />
                </div>
            );
        }   
        else
        {
            let normalClass:string = "normal " + ((this.props.isSelected)?"selected":"");
            return (
                <div className ={normalClass} onClick={this.props.onClick} onDoubleClick={()=>this.handleDoubleClick()}>
                    {this.props.value}
                </div>
            );
        }                          
    }
}

export default applyOnClickOutside(EditableText);