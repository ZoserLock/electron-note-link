// Load Npm Modules
import { app, BrowserWindow, Tray, ipcMain , Menu } from "electron"

// Load local Modules
import Debug            from "../tools/debug"
import Configuration    from "../tools/configuration"
import MainMenu         from "../core/mainMenu"
import GlobalShortcut   from "../core/globalShortcut"
import DataManager      from "../core/dataManager";
import ActionManager    from "../core/actionManager";
import Director         from "../core/director";

export default class Application
{
    private static sInstance:Application;

    private _mainWindow:Electron.BrowserWindow;
    private _trayIcon:Electron.Tray;
    private _exiting:boolean;

    // Singleton functions
    static get instance(): Application 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new Application();
    }

    // Member functions
    private constructor()
    {
        this._exiting = false;
        app.on("ready",() => this.initialize());
    }

    // Entry function of the application
    private initialize():void
    {
        Debug.log("Initializing Application");

        Configuration   .initialize();
        DataManager     .initialize();
        ActionManager   .initialize();
        Director        .initialize();
        GlobalShortcut  .initialize();
        MainMenu        .initialize();

        this.createTrayIcon();
        this.createMainWindow(); 
        
        if(process.env.DEBUG)
        {
            this.initializeDebug();
        }
        
    }

    // Function called only in debug enviroment
    private initializeDebug():void
    {
         this._mainWindow.webContents.toggleDevTools();
    }

    private createTrayIcon():void
    {
        this._trayIcon = new Tray(__dirname + "/img/tray.ico");

        var contextMenu = Menu.buildFromTemplate([
            {
                label: "Show NoteLink", click: () => 
                {
                    this._mainWindow.show();
                }
            },
            {
                label: "Exit", click: () => 
                {
                    this.exit();
                }
            }
        ])
        this._trayIcon.setContextMenu(contextMenu);
        this._trayIcon.setHighlightMode("always");

        this._trayIcon.on("click", () => 
        {
            this._mainWindow.show();
        });

    }
    // Function to create the main windows of the application
    private createMainWindow():void
    {
        this._mainWindow = new BrowserWindow(
        {
            width: 1280, 
            height: 720,
            minWidth: 800,
            minHeight: 600,
            frame:false,
        });

        this._mainWindow.loadURL("file://" + __dirname + "/html/index.html");

        this._mainWindow.on("close", (event:any) => 
        {
            if(!this._exiting)
            {
                event.preventDefault()
                this._mainWindow.hide();
            }
            return false;
        });

        this._mainWindow.on("closed", () => 
        {
            this._mainWindow = null;
        });


    }

    public exit():void
    {
        Debug.log("Exit called by user");
        this._exiting = true;
        app.quit();
    }

    public sendUIMessage(channel:string, data?:any):void
    {
        if(this._mainWindow != null)
        {
            this._mainWindow.webContents.send(channel,data);
        }
    }
}

