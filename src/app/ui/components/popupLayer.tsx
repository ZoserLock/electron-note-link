// Node Modules
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";

export default class PopupLayer extends UIComponent<any, any> 
{
    private _showPopupEvent: (event: any, data: any) => void;
    private _hidePopupEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state =
        {
            popupData:null,
            activePopup:null,
            inputText:""
        }

        this._showPopupEvent = (event:any,data:any)=>this.showPopup(data);
        this._hidePopupEvent = (event:any,data:any)=>this.hidePopup();
    }

    public componentDidMount():void
    {
        this.registerMainListener(MessageChannel.showPopup,this._showPopupEvent);
        this.registerMainListener(MessageChannel.hidePopup,this._hidePopupEvent);
    }

    public componentWillUnmount():void
    {
        this.unregisterMainListener(MessageChannel.showPopup,this._showPopupEvent);
        this.unregisterMainListener(MessageChannel.hidePopup,this._hidePopupEvent);
    }

    private showPopup(data:any):void
    {
        if(data.type == "Confirmation")
        {
            let activePopup:any = this.renderConfirmationPopup(data.title,data.subTitle,data.text,data.okButton,data.cancelButton);
            this.setState({popupData:data, inputText: data.text, activePopup:activePopup});
        }
        else if(data.type == "Input")
        {
            let activePopup:any = this.renderInputPopup(data.title,data.subTitle,data.text,data.okButton,data.cancelButton);
            this.setState({popupData:data, inputText: data.text, activePopup:activePopup});
        }
    }

    private hidePopup():void
    {
        this.setState({activePopup:null});
    }

    //#region Confirmation Popup
    private renderConfirmationPopup(title:string, subTitle:string, text:string, okButton:string, cancelButton:string):any
    {
        return(
            <div className="ui-popup-modal ui-popup-confirmation">
                <header> 
                    <h2>{title}</h2>
                    <span>{subTitle}</span>
                </header>
                <article> 
                    <div className="ui-popup-modal-text">
                        {text}
                     </div>
                </article> 
                <footer>       
                    <div className="ui-inline-spacer"/>
                    <button onClick={()=>this.confirmationPopupResult(false)}> {cancelButton}  </button>
                    <button onClick={()=>this.confirmationPopupResult(true)}> {okButton} </button>
                </footer>
            </div>
        )
    }

    private confirmationPopupResult(value:boolean):void
    {
        let data:any =
        {
            success:value
        }
        this.sendMainMessage(MessageChannel.popupResult, data);
        this.hidePopup();
    }

    private inputPopupResult(value:boolean):void
    {
        if(value)
        {
            if(this.state.popupData.text != this.state.inputText)
            {
                let data:any =
                {
                    success:true,
                    text:this.state.inputText
                }

                this.sendMainMessage(MessageChannel.popupResult, data);
                this.hidePopup();
            }
            else
            {
                let data:any =
                {
                    success:false,
                }

                this.sendMainMessage(MessageChannel.popupResult, data);
                this.hidePopup();
            }
        }
        else
        {
            let data:any =
            {
                success:value,
            }
    
            this.sendMainMessage(MessageChannel.popupResult, data);
            this.hidePopup();
        }
    }
    //#endregion

    //#region Input Popup
    private renderInputPopup(title:string, subTitle:string, text:string, okButton:string, cancelButton:string):any
    {
        return(
            <div className="ui-popup-modal ui-popup-input">
                <header> 
                    <h2>{title}</h2>
                    <span>{subTitle}</span>
                </header>
                <article> 
                    <div className="ui-popup-modal-input">
                        <input  autoFocus defaultValue={text} onChange={(event:any)=>this.handleInputPopupTextChange(event)}/>
                     </div>
                </article> 
                <footer>       
                    <div className="ui-inline-spacer"/>
                    <button onClick={()=>this.inputPopupResult(false)}> {cancelButton}  </button>
                    <button onClick={()=>this.inputPopupResult(true)}> {okButton} </button>
                </footer>
            </div>
        )
    }

    private handleInputPopupTextChange(event:any):any
    {
        this.setState({inputText: event.target.value})
    }

    //#endregion

    public render() 
    {
        if( this.state.activePopup != null)
        {
            return (
                <div className="ui-popup-layer">
                    {this.state.activePopup}
                </div>
            );
        }
        return <div/>
    }

}