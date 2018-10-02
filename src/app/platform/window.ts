import { BrowserWindow } from "electron";
import Debug from "tools/debug";
import { debug } from "util";

export default class Window
{
    private _window:BrowserWindow;

    // Events
    public onHandleWindowClose:(e:Event)=>boolean;
    public onHandleCommandLink:(command:string,value:string)=>void;
    
    constructor()
    {
        this._window = new BrowserWindow(
        {
            width: 1280, 
            height: 720,
            minWidth: 800,
            minHeight: 600,
            frame:false,
            show:false,
            backgroundColor:'#00FFFFFF'
        });

        this._window.loadURL("file://" + __dirname + "/html/index.html");

        this._window.on("close", (event:any) => 
        {
            return this.onHandleWindowClose(event);
        });

        this._window.on("closed", () => 
        {
            this._window = null;
        });

        // Open links in external web browser.
        let wc = this._window.webContents;
        wc.on('will-navigate', function (e, url) 
        {
            Debug.log("will-navigate: "+url);
            if (url != wc.getURL()) 
            {
                e.preventDefault();
                require('electron').shell.openExternal(url)
            }
        });
    
        let window:Window=this;

        wc.on('did-navigate-in-page', function (e:Event, url:String, isMainFrame:boolean) 
        {
            var hash = url.substring(url.indexOf('#'));
            var command = hash.split(":");

            if(command.length == 2)
            {
                window.onHandleCommandLink(command[0],command[1]);
            }

            e.preventDefault();
            
        });
    }

    // Window command
    public sendUIMessage(channel:string, data?:any):void
    {
        this._window.webContents.send(channel,data);
    }
   
    public minimize():void
    {
        if(this._window != null)
        {
            this._window.minimize();
        }
    }

    public maximize():void
    {
        if(this._window != null)
        {
            if(this._window.isMaximized())
            {
                this._window.unmaximize();
            }
            else
            {
                this._window.maximize();
            }
        }
    }

    public show():void
    {
        if(this._window != null)
        {
            this._window.show();
        }
    }

    public hide():void
    {
        if(this._window != null)
        {
            this._window.hide();
        }
    }

    public close():void
    {
        if(this._window != null)
        {
            this._window.close();
        }
    }

 
}