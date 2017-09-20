
import {ipcMain} from "electron"; 
import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Application from "./application";
import DataManager from "./dataManager";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

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
    private _currentNotebook:Notebook;

    //Get/Set
    get currentNotebook(): Notebook 
    {
        return this._currentNotebook;
    }

    // Member Functions
    private constructor()
    {
        this.intializeContextVariables();

        // Update Events
        ipcMain.on("update:LeftPanel",()=>this.updateLeftPanel());
        ipcMain.on("update:NoteList" ,()=>this.updateNoteList());
        ipcMain.on("update:Toolbar"  ,()=>this.updateToolbar());
        ipcMain.on("update:Statusbar",()=>this.updateStatusbar());

        // User Events
        ipcMain.on("action:NewNote",()=>this.actionNewNote());
        ipcMain.on("action:NewNotebook",(event:any,data:any)=>this.actionNewNotebook(event,data));
        ipcMain.on("action:NewNotebookStorage",()=>this.actionNewNotebookStorage());

        // Notebook
        ipcMain.on("action:SelectNotebook",(event:any,data:any)=>this.actionSelectNotebook(event,data));
    }

    private intializeContextVariables():void
    {
        if( this._currentNotebook!=null)
        {
            this._currentNotebook.SetAsUnselected();
            this._currentNotebook = null;
        }

        let storages = DataManager.instance.noteStorages;
        if(storages.length > 0)
        {
            let notebooks = storages[0].notebooks;

            if(notebooks.length > 0)
            {
                this._currentNotebook = notebooks[0];
                this._currentNotebook.SetAsSelected();
            }
        }
    }

    ///////////
    // Update Function

    public updateLeftPanel():void
    {
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;

        let selectedNotebookId:String = "";

        if(this._currentNotebook != null)
        {
            selectedNotebookId = this._currentNotebook.id;
        }

        Application.instance.sendUIMessage("update:LeftPanel",{storages:storages, selectedNotebookId:selectedNotebookId});
    }

    public updateNoteList():void
    {
        if(this._currentNotebook != null)
        {
            Application.instance.sendUIMessage("update:NoteList",{notes:this._currentNotebook.notes});
        }
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
        let storage = NotebookStorage.create(uuid(),"E:/Tests/NoteLinkData");

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        this.updateLeftPanel();
    }
    
    private actionNewNotebook(event:any, data:any):void
    {
        let storageId = data.storage;

        let storage:NotebookStorage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), Path.join(storage.folderPath,"/notebooks"));

            if(DataManager.instance.saveNotebook(notebook))
            {
                DataManager.instance.addNotebook(notebook);
                storage.addNotebook(notebook);
                DataManager.instance.saveStorage(storage);
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
            let note:Note = Note.create(uuid(), Path.join(this._currentNotebook.folderPath,this._currentNotebook.id));
            
            if(DataManager.instance.addNote(note))
            {
                DataManager.instance.saveNote(note);
                this._currentNotebook.addNote(note);
                this.updateNoteList();
            }
        }
    }


    private actionSelectNotebook(event:any, data:any):void
    {
        if( this._currentNotebook!=null)
        {
            this._currentNotebook.SetAsUnselected();
            this._currentNotebook = null;
        }

        let notebook:Notebook = DataManager.instance.getNotebook(data.notebookId);

        if(notebook!=null)
        {
            this._currentNotebook = notebook;
            this._currentNotebook.SetAsSelected();

            this.updateLeftPanel();
            this.updateNoteList();
        }
    }

  
}