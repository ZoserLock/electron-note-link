// Core
import Core from "core/core";

export default interface Platform
{
    // Initialization
    initialize(core:Core):void;

    // Inter-process comm functions
    registerUIListener(channel:string, callback:(data:any) => void):void;
    sendUIMessage(channel:string, data?:any):void;

    // Window Control Function
    minimizeMainWindow():void;
    maximizeMainWindow():void;
    closeMainWindow():void;

    // Window event
    windowLoadedEvent():void;

    // System Popups
    showOpenDirectoryDialog(title:string):string;
}