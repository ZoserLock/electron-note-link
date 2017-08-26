// Load Npm Modules
import { app, BrowserWindow } from 'electron'

// Load local Modules
import Debug            from '../tools/debug'
import Configuration    from '../tools/configuration'
import MainMenu         from '../ui/mainMenu'
import GlobalShortcut   from '../ui/globalShortcut'
import DataManager      from '../core/DataManager';
import ActionManager    from '../core/actionManager';

export default class Application
{
    private static sInstance:Application;

    private _app:Electron.App;
    private _mainWindow:Electron.BrowserWindow;

    // Singleton functions
    static get instance(): Application 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new Application(app);
    }

    // Member functions
    private constructor(app:Electron.App)
    {
        this._app = app;
        this._app.on('ready',() => this.initialize());
        this._app.on('window-all-closed', () => this.quit());
    }

    // Entry function of the application
    private initialize():void
    {
        Debug.log("Initializing Application");

        Configuration.initialize();
        DataManager.initialize();
        GlobalShortcut.initialize();
        ActionManager.initialize();

        MainMenu.initialize();

        this.initializeMainWindow(); 
        
        if(process.env.DEBUG)
        {
          //  this.initializeDebug();
        }
    }

    // Function called only in debug enviroment
    private initializeDebug():void
    {
        BrowserWindow.addDevToolsExtension("C:/Users/zoser/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.0_0");
        this._mainWindow.webContents.openDevTools();        
    }

    // Function called when all windows are closed 
    private quit():void
    {
        Debug.log("All windows closed");
        if (process.platform !== 'darwin') 
        {
            Debug.log("Application Quit");
            this._app.quit();
        }
    }

    // Function to create the main windows of the application
    private initializeMainWindow():void
    {
        this._mainWindow = new BrowserWindow(
        {
            width: 1280, 
            height: 720,
            minWidth: 800,
            minHeight: 600,
        });

        this._mainWindow.loadURL('file://' + __dirname + '/html/index.html');

        this._mainWindow.on('closed', () => 
        {
            this._mainWindow = null;
        });
    }

    public exit():void
    {
        Debug.log("Exit called by user");

        if(this._mainWindow != null)
        {
            this._mainWindow.close();
        }
    }
}
