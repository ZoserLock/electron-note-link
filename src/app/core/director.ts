
import {ipcMain} from "electron"; 
import * as uuid from "uuid/v4"


import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";

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

    // Member Variables
    private _currentNotebookStorage:NotebookStorage;
    private _currentNotebook:Notebook;

    //Get/Set
    get currentNotebook(): Notebook 
    {
        return this._currentNotebook;
    }

    get currentNotebookStorage(): NotebookStorage 
    {
        return this._currentNotebookStorage;
    }

    // Member Functions
    private constructor()
    {
        this.intializeContextVariables();

        // Update Events
        ipcMain.on("update:LeftPanel",()=>this.updateLeftPanel());
        ipcMain.on("update:Toolbar"  ,()=>this.updateToolbar());
        ipcMain.on("update:Statusbar",()=>this.updateStatusbar());

        // User Events
        ipcMain.on("action:NewNote",()=>this.actionNewNote());
        ipcMain.on("action:NewNotebook",(event:any,data:any)=>this.actionNewNotebook(event,data));
        ipcMain.on("action:NewNotebookStorage",()=>this.actionNewNotebookStorage());

    }

    private intializeContextVariables():void
    {
        let storages = DataManager.instance.noteStorages;
        if(storages.length > 0)
        {
            this._currentNotebookStorage = storages[0];
            let notebooks = this._currentNotebookStorage.notebooks;

            if(notebooks.length > 0)
            {
                this._currentNotebook = notebooks[0];
            }
        }
    }

    ///////////
    // Update Function

    public updateLeftPanel():void
    {
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;

        let currentStorage:String = "";

        if(this._currentNotebookStorage!=null)
        {
            currentStorage = this._currentNotebookStorage.id;
        }

        Application.instance.sendUIMessage("update:LeftPanel",{storages:storages, currentStorage:currentStorage});
    }

    public updateToolbar():void
    {
        // To be implemented
    }

    public updateStatusbar():void
    {
        // To be implemented
    }


    ///////////
    //Actions
    private actionNewNotebookStorage():void
    {
        let storage = new NotebookStorage(uuid(),"E:/Tests/NoteLinkData");

        DataManager.instance.addStorage(storage);

        this.updateLeftPanel();
    }
    
    private actionNewNotebook(event:any, data:any):void
    {
        
        let storageId = data.storage;

        Debug.log("actionNewNotebook id:"+storageId);

        let storage:NotebookStorage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), storage.path+"/notebooks");

            if(DataManager.instance.saveNotebook(notebook))
            {
                storage.addNotebook(notebook);
            }

            this.updateLeftPanel();
        }
        else
        {
            Debug.logError("storage does not exist");
        }
    }

    private actionNewNote():void
    {
        if(this._currentNotebook != null)
        {
        //    DataManager.instance.createNewNote(this._currentNotebook);
            Debug.log("[Action] New Note");
        }
    }

  
}