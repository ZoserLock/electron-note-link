// Load Npm Modules
import { app, BrowserWindow, Tray, ipcMain , Menu } from "electron"

// Load local Modules
import Debug            from "../tools/debug"
import Configuration    from "../tools/configuration"
import MainMenu         from "../core/mainMenu"
import GlobalShortcut   from "../core/globalShortcut"
import DataManager      from "../core/dataManager";
import Director         from "../core/director";

// Controllers
import LeftPanelController from "../controllers/leftPanelController";
import NoteListController from "../controllers/noteListController";
import NoteViewController from "../controllers/noteViewController";

export default class Application
{
    private static sInstance:Application;

    private _mainWindow:BrowserWindow;
    private _trayIcon:Tray;
    private _exiting:boolean;

    // Controllers
    private _leftPanelController:LeftPanelController;
    private _noteListController:NoteListController;
    private _noteViewController:NoteViewController;

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

        // Initialise Singletons
        Configuration   .initialize();
        DataManager     .initialize();
        Director        .initialize();
        GlobalShortcut  .initialize();
        MainMenu        .initialize();

        this.createTrayIcon();
        this.createMainWindow(); 
        
         // Initialize Active Presenters
        this._leftPanelController = new LeftPanelController(this._mainWindow);
        this._noteListController  = new NoteListController(this._mainWindow);
        this._noteViewController  = new NoteViewController(this._mainWindow);

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

