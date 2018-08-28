import * as React from "react";
import {ipcRenderer} from "electron"; 
import Message from "../../core/message";

export default class PopupLayer extends React.Component<any, any> 
{
    private _showPopupEvent: (event: any, data: any) => void;
    private _hidePopupçevent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state=
        {
            activePopup:null
        }

        this._showPopupEvent = (event:any,data:any)=>this.showPopup(data);
        this._hidePopupçevent = (event:any,data:any)=>this.hidePopup();
    }

    public componentDidMount():void
    {
        ipcRenderer.addListener(Message.showPopup,this._showPopupEvent);
        ipcRenderer.addListener(Message.hidePopup,this._hidePopupçevent);
    }

    public componentWillUnmount():void
    {
        ipcRenderer.removeListener(Message.showPopup,this._showPopupEvent);
        ipcRenderer.removeListener(Message.hidePopup,this._hidePopupçevent);
    }

    private showPopup(data:any):void
    {
        if(data.type == "Confirmation")
        {
            let activePopup:any = this.renderConfirmationPopup(data.title,data.subTitle,data.text,data.okButton,data.cancelButton);
            this.setState({activePopup:activePopup});
        }
    }

    private hidePopup():void
    {
        this.setState({activePopup:null});
    }

    private renderConfirmationPopup(title:string, subTitle:string, text:string, okButton:string, cancelButton:string):any
    {
        return(
            <div className="ui-popup-modal">
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
        ipcRenderer.send(Message.popupResult, data);
        this.hidePopup();
    }


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