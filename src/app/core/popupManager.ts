import {ipcMain,BrowserWindow} from "electron"; 
import Message from "./message";
import Debug from "../tools/debug";

export default class PopupManager
{
    // Singleton
    private static sInstance:PopupManager;

    // Get/Set
    static get instance(): PopupManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new PopupManager();
    }

    private _window:BrowserWindow;

    private _onOkFunction:()=>void;
    private _onCancelFunction:()=>void;

    private _popupShown:boolean = false;

    constructor()
    {
        ipcMain.on(Message.popupResult,(event:any,data:any) =>{this.onPopupResult(data);});
    }

    public setWindow(window:BrowserWindow):void
    {
        this._window = window;
    }

    protected sendUIMessage(channel:string, data?:any):void
    {
        if(this._window != null)
        {
            this._window.webContents.send(channel,data);
        }
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

    public showConfirmationPanel(title:string, text:string, okButton:string, cancelButton:string, onOk:() => void, onCancel:() => void):void
    {
        if(!this._popupShown)
        {
            let data:any =
            {
                type:"Confirmation",
                title:title,
                text:text,
                okButton:okButton,
                cancelButton:cancelButton
            }

            this._onOkFunction     = onOk;
            this._onCancelFunction = onCancel;

            this.sendUIMessage(Message.showPopup, data);
        }
        else
        {
            Debug.log("Trying to show a popup while already another popup is being shown");
        }
    }
}