import { app, ipcMain, dialog, shell,clipboard ,globalShortcut} from "electron"

import Debug           from "tools/debug";

import Core            from "core/core";
import Platform        from "core/platform";

import Window          from "platform/window";
import TrayController  from "platform/trayController";
import MainMenu        from "platform/mainMenu";

import MessageChannel  from "presenter/messageChannel";

export default class Application implements Platform
{

    // Dependencies
    private _core:Core;
    
    // Member variables
    private _trayController:TrayController;
    private _mainMenu:MainMenu;
    
    private _mainWindow:Window;

    private _userExit:boolean;
    private _startMinimized:boolean;

    constructor(startMinimized:boolean)
    {
        this._userExit = false;
        this._startMinimized = startMinimized;

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
        this._mainWindow.onHandleCommandLink = (command:string,value:string)=>this.handleCommandEvent(command,value);

        this._mainMenu = new MainMenu();
        this._mainMenu.onHandleMenuClick =(menu:string)=>this.handleMenuClick(menu);

        this.registerShortcuts();
    }

    private registerShortcuts():void
    {
        globalShortcut.register("CommandOrControl+Alt+Shift+K", () =>
        {
            this._mainWindow.show();
            this._core.beginQuickSearch();
        }); 

        globalShortcut.register("CommandOrControl+Alt+N", () =>
        {
            this._mainWindow.show();
            this._core.createNewNote(null);
        }); 
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
        
        if(!this._startMinimized)
        {
            this._mainWindow.show();
        }
     
        // Timeout needed to allow one render of the main window and also show the app logo.
        setTimeout(() => 
        {
            this._core.mainWindowLoaded();
            this.sendUIMessage(MessageChannel.hideLoading);
        }, 1000);
    }

    // Event to show the main menu to the user, called when the user press the top left button of the window.
    public windowMenuEvent():void
    {
        Debug.log("[Application] Menu Show Called by user");
        this._mainMenu.show();
    }

    // Function called when an item of the file menu is pressed
    private handleMenuClick(name:string):void
    {
        Debug.log("[Application] Menu Click: "+name);
        switch(name)
        {
            case "New Note":
                this._core.createNewNote(null);
            break;
            case "Preferences":
              //  this._core.showPreferences(null); // TODO implement post v1.0
            break;
            case "Close":
                this.handleWindowClose(null);
            break;
            case "Exit":
                this.exitApplication();
            break;
        }
    }

    // Function called when the app is requested to exit. If the user did not executed the action the window is closed to tray.
    private handleWindowClose(event:Event):boolean
    {
        if(process.env.DEBUG)
        {
            // In debug mode close the application and do not throw it to tray
            return false;
        }

        if(!this._userExit)
        {
            if(event != null)
            {
                event.preventDefault()
            }
            this._mainWindow.hide();
            return true;
        }
        return false;
    }

    // Function called when an special link is opened. Right now is just used for the internal links
    private handleCommandEvent(command:string,value:string):void
    {
        if(command == "#note")
        {
            this._core.selectNote(value, true);
        }
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

    public setClipboard(text: string): void 
    {
        clipboard.writeText(text);
    }
    // OS
    public showOnExplorer(path:string):void
    {
        shell.showItemInFolder(path);
    }
}