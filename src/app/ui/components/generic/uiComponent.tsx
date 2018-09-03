// Node.js
import { ipcRenderer } from "electron";
import * as React from "react";


export default class UIComponent<T,U> extends React.Component<T, U> 
{
    registerMainListener(channel:string, callback:(data:any) => void):void
    {
        ipcRenderer.on(channel,(event:any,data:any) => callback(data));
    }

    sendMainMessage(channel:string, data?:any):void
    {
        ipcRenderer.send(channel,data);
    }
}