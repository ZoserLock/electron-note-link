// Npm Modules
import { app, BrowserWindow } from 'electron'

class Application
{
    private _app:Electron.App;
    private _mainWindow:Electron.BrowserWindow;

    constructor(app:Electron.App)
    {
        this._app = app;
        this._app.on('ready',()=>this.initialize());
        this._app.on('window-all-closed', ()=>this.quit());
    }

    public initialize():void
    {
        this.createMainWindow();
    }

    public activate():void
    {
        if(this._mainWindow==null)
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

        this._mainWindow = new BrowserWindow({width: 1024, height: 768});

        this._mainWindow.loadURL('file://'+__dirname+'/html/index.html');

        this._mainWindow.on('closed', () => 
        {
            this._mainWindow = null
        });
    }

}

// Create Application
const application = new Application(app);
