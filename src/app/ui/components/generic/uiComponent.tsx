// Node.js
import { ipcRenderer } from "electron";
import * as React from "react";

export default class UIComponent<T,U> extends React.Component<T, U> 
{
    registerMainListener(channel:string, callback:(event:any, data:any) => void):void
    {
        ipcRenderer.addListener(channel, callback);
    }

    unregisterMainListener(channel:string, callback:(event:any, data:any) => void):void
    {
        ipcRenderer.removeListener(channel, callback);
    }

    sendMainMessage(channel:string, data?:any):void
    {
        ipcRenderer.send(channel,data);
    }
}