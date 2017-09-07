
import {ipcMain} from "electron"; 

import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";
import NotebookStorage from "../notes/notebookStorage";

export default class Director
{
    // Singleton
    private static sInstance:Director;

    // Get/Set
    static get instance(): Director 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        Debug.log("Inityializer moment: "+DataManager.instance);
        this.sInstance = new Director();
    }

    // Static Variables 


    // Member Variables
    private constructor()
    {
        ipcMain.on("update:LeftPanel",()=>this.updateLeftPanel());
        ipcMain.on("update:Toolbar",()=>this.updateToolbar());

    }

    public updateLeftPanel()
    {
        Debug.log("updateLeftPanel moment: "+DataManager.instance);
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;
        Application.instance.sendUIMessage("update:LeftPanel",{storages:storages, current:"Notebook2"});
    }

    public updateToolbar()
    {
        // To be implemented
    }
}