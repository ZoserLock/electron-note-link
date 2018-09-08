import { app, BrowserWindow, ipcMain, dialog } from "electron"

import Debug           from "tools/debug";

import Core            from "core/core";
import Platform        from "core/platform";

import Window          from "platform/window";
import TrayController  from "platform/trayController";

import MessageChannel  from "presenter/messageChannel";
import PopupManager    from "core/controllers/popupController";


export default class Application implements Platform
{
    // Dependencies
    private _core:Core;
    
    // Member variables
    private _trayController:TrayController;
    
    private _mainWindow:Window;

    private _userExit:boolean;

    constructor()
    {
        this._userExit = false;

        this._trayController = new TrayController(
            ()=>this.showApplication(),
            ()=>this.exitApplication()
        );
    }

    public initialize(core:Core):void
    {
        this._core = core;

        this._trayController.initialize();
        
        this._mainWindow = new Window();

        this._mainWindow.onHandleWindowClose = (e:Event)=>this.handleWindowClose(e);

    }

    public exitApplication():void
    {
        Debug.log("[Application] Exit called by user");
        this._userExit = true;
        app.quit();
    }

    public showApplication():void
    {
        Debug.log("[Application] Show called by user");
        this._mainWindow.show();
    }

    public windowLoadedEvent():void
    {
        Debug.log("[Application] Main Window Loaded");
        
        this._mainWindow.show();
        this._core.mainWindowLoaded();

        //PopupManager.instance.setWindow(this._mainWindow);
    }

    // Window Event
    private handleWindowClose(event:Event):boolean
    {
        // Just for debug
        return false;// Remove for release.

        if(!this._userExit)
        {
            event.preventDefault()
            this._mainWindow.hide();
        }
        return false;
    }

    // Window control Function
    public minimizeMainWindow():void
    {
        this._mainWindow.minimize();
    }
  
    public maximizeMainWindow():void
    {
        this._mainWindow.maximize();
    }
 
    public closeMainWindow():void
    {
        this._mainWindow.close();
    }

    // Ipc Communication Functions
    public registerUIListener(channel:string, callback:(data:any) => void):void
    {
        ipcMain.on(channel,(event:any,data:any) => callback(data));
    }

    public sendUIMessage(channel:string, data?:any):void
    {
        this._mainWindow.sendUIMessage(channel,data);
    }

    // Dialog management
    public showOpenDirectoryDialog(title: string):string
    {
        let targetPath = dialog.showOpenDialog({title:title,properties:["openDirectory"]});

        if(targetPath != null && targetPath.length > 0)
        {
            return targetPath[0];
        }
        else
        {
            return null;
        }
    }
}