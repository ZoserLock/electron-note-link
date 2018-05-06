import {ipcMain, BrowserWindow} from "electron"; 
import * as EventEmitter from "events";

export default class Controller
{
    private _window:Electron.BrowserWindow;

    constructor(window:Electron.BrowserWindow)
    {
        this._window = window;
    }

    protected sendUIMessage(channel:string, data?:any):void
    {
        if(this._window != null)
        {
            this._window.webContents.send(channel,data);
        }
    }

    protected sendMainMessage(channel:string, data?:any):void
    {
        ipcMain.emit(channel,null,data);
    }
}