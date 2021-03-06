// Node.js
import {ipcMain} from "electron"; 

// Tools
import Debug from "tools/debug";

// Core
import Core         from "core/core";
import Platform     from "core/platform";
import Presentation from "core/presentation";

export default class Presenter
{
    protected _core: Core;
    protected _platform: Platform;
    protected _presentation: Presentation;

    constructor()
    {

    }

    public initialize(presentation:Presentation, core:Core, platform:Platform):void
    {
        this._core         = core;
        this._platform     = platform;
        this._presentation = presentation;

        this.onRegisterListeners();
    }

    public update():void
    {
        this.onUpdateRequested();
    }

    protected registerUIListener(channel:string, callback:(data:any) => void):void
    {
        this._platform.registerUIListener(channel,callback);
    }
    
    protected sendUIMessage(channel:string, data?:any):void
    {
        this._platform.sendUIMessage(channel,data);
    }

    // Overridable Functions
    protected onRegisterListeners():void
    {
        // Overridable
    }

    protected onUpdateRequested():void
    {
        // Overridable
    }

}