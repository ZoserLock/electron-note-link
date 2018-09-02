// Load Npm Modules
import { app, BrowserWindow, Tray, ipcMain , Menu } from "electron"

// Load local Modules
import Debug            from "tools/debug"
import Configuration    from "tools/configuration"
import MainMenu         from "./mainMenu"
import GlobalShortcut   from "./globalShortcut"
import DataManager      from "core/dataManager";
import Editor           from "core/editor";
import PopupManager     from "core/popupManager";

// Controllers
import LeftPanelController from "presenter/leftPanelController";
import NoteListController from  "presenter/noteListController";
import NoteViewController from  "presenter/noteViewController";
import Message from "presenter/messageChannel";

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
        Editor          .initialize();
        GlobalShortcut  .initialize();
        MainMenu        .initialize();
        PopupManager    .initialize();

        ipcMain.on(Message.windowMinimize,()=>this.windowMinimize());
        ipcMain.on(Message.windowMaximize,()=>this.windowMaximize());
        ipcMain.on(Message.windowClose   ,()=>this.windowClose());
        ipcMain.on(Message.windowLoaded  ,()=>this.onWindowCreated());

        this.createTrayIcon();
        this.createMainWindow(); 
    }

    private onWindowCreated()
    {
        this._mainWindow.show();

        Debug.log("onWindowCreated");
        
        // Initialize Data and cache
        DataManager.instance.checkStorageIntegrety();
        Editor.instance.initializeEditorStatus();

        PopupManager.instance.setWindow(this._mainWindow);

        // Initialize Active Presenters
        this._leftPanelController = new LeftPanelController(this._mainWindow);
        this._noteListController  = new NoteListController(this._mainWindow);
        this._noteViewController  = new NoteViewController(this._mainWindow);

        if(process.env.DEBUG)
        {
            this.initializeDebug();
        }

        Editor.instance.updateAll();
    }

    // Function called only in debug enviroment
    private initializeDebug():void
    {
        //this._mainWindow.webContents.toggleDevTools();
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
            show:false,
        });

        this._mainWindow.loadURL("file://" + __dirname + "/html/index.html");

        this._mainWindow.on("close", (event:any) => 
        {
            // Just for debug
            return false;// Remove for release.

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

        // Open links in external web browser.
        let wc = this._mainWindow.webContents;
        wc.on('will-navigate', function (e, url) 
        {
            Debug.log("will-navigate: "+url);
            if (url != wc.getURL()) 
            {
                e.preventDefault();
                require('electron').shell.openExternal(url)
            }
        });

        wc.on('did-navigate-in-page', function (e:Event, url:String, isMainFrame:boolean) 
        {
            var hash = url.substring(url.indexOf('#'));
            var command = hash.split(":");

            if(command.length == 2)
            {
                if(command[0] == "#note")
                {
                    Editor.instance.selectNote(command[1]);
                }
            }

            e.preventDefault();
          
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

    // Window command
    public windowMinimize():void
    {
        if(this._mainWindow != null)
        {
            this._mainWindow.minimize();
        }
    }

    public windowMaximize():void
    {
        if(this._mainWindow != null)
        {
            if(this._mainWindow.isMaximized())
            {
                this._mainWindow.unmaximize();
            }
            else
            {
                this._mainWindow.maximize();
            }
        }
    }

    public windowShow():void
    {
        if(this._mainWindow != null)
        {
            this._mainWindow.show();
        }
    }

    public windowClose():void
    {
        if(this._mainWindow != null)
        {
            this._mainWindow.close();
        }
    }

    public toggleDevTools():void
    {
        this._mainWindow.webContents.toggleDevTools();
    }


}
