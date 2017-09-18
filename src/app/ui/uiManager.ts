
import {ipcRenderer} from "electron"; 

export default class UIManager
{
    private static sInstance:UIManager;

    // Get/Set
    static get instance(): UIManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new UIManager();
    }

    private constructor()
    {

    }

    public sendMessage(channel:string, data?:any):void
    {
        ipcRenderer.send(channel,data);
    }
}