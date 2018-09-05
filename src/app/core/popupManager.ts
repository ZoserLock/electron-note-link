import Message from "presenter/messageChannel";
import Debug from "../tools/debug";
import Platform from "./platform";

export default class PopupManager
{
    // Dependencies
    private _platform:Platform;

    private _onOkFunction:()     => void;
    private _onCancelFunction:() => void;

    private _popupShown:boolean = false;

    constructor(platform:Platform)
    {
        this._platform = platform;
        this._platform.registerUIListener(Message.popupResult,(data:any) =>{this.onPopupResult(data);});
    }

    public onPopupResult(data:any):void
    {
        if(data.success)
        {
            if(this._onOkFunction != null)
            {
                this._onOkFunction();
            }
        }
        else
        {
            if(this._onCancelFunction != null)
            {
                this._onCancelFunction();
            }
        }
    }

    public showConfirmationPanel(title:string, subTitle:string, text:string, okButton:string, cancelButton:string, onOk:() => void, onCancel:() => void):void
    {
        if(!this._popupShown)
        {
            let data:any =
            {
                type:"Confirmation",
                title:title,
                subTitle:subTitle,
                text:text,
                okButton:okButton,
                cancelButton:cancelButton
            }

            this._onOkFunction     = onOk;
            this._onCancelFunction = onCancel;

            this._platform.sendUIMessage(Message.showPopup, data);
        }
        else
        {
            Debug.log("Trying to show a popup while already another popup is being shown");
        }
    }
}