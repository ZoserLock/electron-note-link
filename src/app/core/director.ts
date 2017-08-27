
import {ipcMain} from "electron"; 

import Application from "./application";

export default class Director
{
    private static sInstance:Director;

    // Get/Set
    static get instance(): Director 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new Director();
    }

    private constructor()
    {
        ipcMain.on("update:LeftPanel",()=>this.updateLeftPanel());
        ipcMain.on("update:Toolbar",()=>this.updateToolbar());
    }

    public updateLeftPanel()
    {
        let notebooks = [{name:"Notebook1"},{name:"Notebook2"},{name:"Notebook3"},{name:"Notebook4"}]
        Application.instance.sendUIMessage("update:LeftPanel",{notebooks:notebooks,current:"Notebook2"});   
    }

    public updateToolbar()
    {
        // To be implemented
    }
}