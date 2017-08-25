// Npm Modules
import { app, BrowserWindow } from 'electron'

// Local Modules
// Load Enviromental Variables
require('./env')

import MainMenu from './app/mainmenu'
import Debug from './app/tools/debug'
import PersistenceManager from './app/persistence/persistenceManager';

class Application
{
    private _app:Electron.App;
    private _mainWindow:Electron.BrowserWindow;
    private _persistenceManager:PersistenceManager;

    constructor(app:Electron.App)
    {
        this._app = app;
        this._app.on('ready',()=>this.initialize());
        this._app.on('window-all-closed', ()=>this.quit());

        this._persistenceManager = new PersistenceManager();
    }

    public initialize():void
    {
        if(process.env.DEBUG)
        {
            BrowserWindow.addDevToolsExtension("C:/Users/zoser/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.0_0");
        }
        Debug.log("Testing");
        MainMenu.initialize();
        this.createMainWindow(); 

        this._persistenceManager.listFolderFiles();
    }

    public activate():void
    {
        if(this._mainWindow == null)
        {
            this.createMainWindow();
        }
    }

    public quit():void
    {
        if (process.platform !== 'darwin') 
        {
            this._app.quit();
        }
    }

    public createMainWindow():void
    {
        console.log(process.cwd());

        this._mainWindow = new BrowserWindow({
            width: 1280, 
            height: 720,
            minWidth: 800,
            minHeight: 600,
        });

        this._mainWindow.loadURL('file://'+__dirname+'/html/index.html');

        this._mainWindow.webContents.openDevTools();

        this._mainWindow.on('closed', () => 
        {
            this._mainWindow = null
        });

        
    }

}

// Create Application
const application = new Application(app);
