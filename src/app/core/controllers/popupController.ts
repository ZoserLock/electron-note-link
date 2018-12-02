
// Tools
import Debug    from "tools/debug";

// Presenter
import Message  from "presenter/messageChannel";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

export default class PopupManager
{
    // Dependencies
    private _core:Core;
    private _platform:Platform;
    private _presentation:Presentation;
    private _dataManager:DataManager;

    private _popupShown:boolean = false;

    private _onOkFunction:(data:any) => void;
    private _onCancelFunction:()     => void;

    constructor(core:Core, platform:Platform, presentation:Presentation, dataManager:DataManager)
    {
        this._core         = core;
        this._presentation = presentation;
        this._platform     = platform;
        this._dataManager  = dataManager;

        this._platform.registerUIListener(Message.popupResult,(data:any) =>{this.onPopupResult(data);});
    }

    public onPopupResult(data:any):void
    {
        if(data.success)
        {
            if(this._onOkFunction != null)
            {
                this._onOkFunction(data);
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

    public showConfirmationPanel(title:string, subTitle:string, text:string, okButton:string, cancelButton:string, onOk:DataAction, onCancel:VoidAction):void
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

    public showInputPanel(title:string, subTitle:string, text:string, okButton:string, cancelButton:string, onOk:DataAction, onCancel:VoidAction):void
    {
        if(!this._popupShown)
        {
            let data:any =
            {
                type:"Input",
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

    public showInfoPanel(title:string, subTitle:string, text:string, okButton:string, onOk:DataAction):void
    {
        if(!this._popupShown)
        {
            let data:any =
            {
                type:"Info",
                title:title,
                subTitle:subTitle,
                text:text,
                okButton:okButton,
            }

            this._onOkFunction     = onOk;
            this._onCancelFunction = null;
            this._platform.sendUIMessage(Message.showPopup, data);
        }
        else
        {
            Debug.log("Trying to show a popup while already another popup is being shown");
        }
    }
}