// Load Npm Modules
import { app, BrowserWindow } from 'electron'

// Load Enviromental Variables
require('./env')

// Load local Modules
import MainMenu from './app/mainMenu'
import Debug from './app/tools/debug'
import StorageManager from './app/core/storageManager';

class Application
{
    private app:Electron.App;
    private mainWindow:Electron.BrowserWindow;

    constructor(app:Electron.App)
    {
        this.app = app;
        this.app.on('ready',()=>this.initialize());
        this.app.on('window-all-closed', ()=>this.quit());
    }

    // Function called when electron is ready
    private initialize():void
    {
        MainMenu.initialize();
        StorageManager.initialize();

        this.initializeMainWindow(); 

        if(process.env.DEBUG)
        {
            this.initializeDebug();
        }
    }

    // Function called only in debug enviroment
    private initializeDebug()
    {
        BrowserWindow.addDevToolsExtension("C:/Users/zoser/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.0_0");
        this.mainWindow.webContents.openDevTools();        
    }

    // Function called when all windows are closed
    private quit():void
    {
        if (process.platform !== 'darwin') 
        {
            this.app.quit();
        }
    }

    public initializeMainWindow():void
    {
        this.mainWindow = new BrowserWindow(
        {
            width: 1280, 
            height: 720,
            minWidth: 800,
            minHeight: 600,
        });

        this.mainWindow.loadURL('file://' + __dirname + '/html/index.html');

        this.mainWindow.on('closed', () => 
        {
            this.mainWindow = null
        });
    }
}

// Create and initialize Application
const application = new Application(app);
