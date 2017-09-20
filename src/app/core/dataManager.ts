
import { app} from "electron";
import * as Path from "path";
import * as fs from "fs-extra";


import Debug from "../tools/debug";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";



interface NotebookMap 
{
    [id: string]: Notebook;
}

interface StorageMap 
{
    [id: string]: NotebookStorage;
}

interface NoteMap 
{
    [id: string]: Note;
}

export default class DataManager
{
    // Singleton 
    public static sInstance:DataManager;

    static get instance(): DataManager 
    {
        return DataManager.sInstance;
    }

    static initialize():void
    {
        DataManager.sInstance = new DataManager();
    }

    // Static variables
    private sSaveFileName:string = "data.json";
    private sVersion:number = 1;

    // Member Variables
    private _savePath:string;

    private _storageList: Array<NotebookStorage> = new Array<NotebookStorage>();
    private _notebookList: Array<Notebook> = new Array<Notebook>();

    // Data maps
    private _storages: StorageMap ={};
    private _notebooks: NotebookMap = {};
    private _notes: NoteMap = {};

    // Performance Counter
    private _noteLoadedCount = 0;

    // Get/Set
    
    get noteStorages(): Array<NotebookStorage>  
    {
        return this._storageList;
    }

    // Member Functions
    private constructor()
    {
        this._storageList = new Array<NotebookStorage>();
        this._savePath = Path.join(app.getPath("userData"),this.sSaveFileName);
        
        Debug.log("[DataManager] Save File Location: "+this._savePath);

        this.checkStorageIntegrety();
    }

    private checkStorageIntegrety():void
    {
        Debug.log("[DataManager] Checking storage integrety...");

        if(!this.loadApplicationData())
        {
            Debug.log("[DataManager] Creating new Storage File!");
            this.clearApplicationData();
            this.createApplicationData();
            this.saveApplicationData();
        }
    }
    
    private createApplicationData():void
    {
        this._storageList = new Array<NotebookStorage>();
        this._notebookList = new  Array<Notebook>();
    }

    private clearApplicationData():boolean
    {
        try 
        {
            fs.removeSync(this._savePath);
            return true;
        }
        catch(e)
        {
            Debug.logError("Clear Storage Failed: "+e);
            return false;
        }
    }

    private saveApplicationData():boolean
    {
        let storageInfo:any[] = [];
        
        for(let a = 0;a < this._storageList.length; ++a)
        {
            storageInfo.push(this._storageList[a].getFullPath());
        }

        let saveFile:any =
        {
            version: this.sVersion,
            storages:storageInfo,
        }

        try 
        {
            fs.writeJsonSync(this._savePath,saveFile,{spaces:4});
            return true;
        }
        catch(e)
        {
            Debug.logError("Save Storage Failed: "+e);
        }

        return false;
    }

    private loadApplicationData():boolean
    {
        console.time("load App Data");
        let dataRaw;
        try 
        {
            dataRaw = fs.readJsonSync(this._savePath);
        }
        catch(e)
        {
            Debug.logError("Load Storage List Failed: "+e);
            return false;
        }

        // Handle Save Version mismatch
        if(dataRaw.version != undefined)
        {
            if(dataRaw.version != this.sVersion)
            {
                Debug.log("Different File Version Implement Conversion");
                // Convert DataRaw
                return false;
            }
        }

        // Load storage
        this.loadStorageData(dataRaw);
        this.loadNotebooks();
        this.loadNotes();

        console.timeEnd("load App Data");
        Debug.log("Notes Loaded: "+this._noteLoadedCount);
        return true;
    }

    private loadStorageData(dataRaw:any):void
    {
        if(dataRaw.storages != undefined)
        {
            if(dataRaw.storages instanceof Array)
            {
                for(var a = 0;a < dataRaw.storages.length; ++a)
                {
                    let storagePath = dataRaw.storages[a];

                    let storageDataRaw;

                    try 
                    {
                        storageDataRaw = fs.readJsonSync(storagePath);
                    }
                    catch(e)
                    {
                        Debug.logError("Load Storage Failed: "+e);
                        continue;
                    }

                    let noteStorage:NotebookStorage = NotebookStorage.createFromSavedData(storageDataRaw, Path.dirname(storagePath));

                    if(!this.addStorage(noteStorage, false))
                    {
                        continue;
                    }
                }
            }
        }
    }

    private loadNotebooks():void
    {
        for(let a = 0;a < this._storageList.length; ++a)
        {
            let storage:NotebookStorage = this._storageList[a];

            let notebooksFolder:string = storage.getNotebooksFolderPath();
            
            let files:string[] = [];
            try 
            {
                files = fs.readdirSync(notebooksFolder);
            }
            catch(e)
            {
                Debug.logError("Read Notebook Folder Failed for Notebook"+storage.getFullPath() +" Error:"+ e);
                continue;
            }

            // Load Storage Notebooks
            for(let b = 0;b < files.length; ++b)
            {
                let notebookPath:string = files[b];

                if(Path.extname(notebookPath) !== ".json") 
                {
                    continue;
                }

                let notebookDataRaw:any;
                
                try 
                {
                    notebookDataRaw = fs.readJsonSync(Path.join(notebooksFolder,notebookPath));
                }
                catch(e)
                {
                    Debug.logError("Load Notebook Failed: "+e);
                    continue;
                }

                let notebook:Notebook = Notebook.createFromSavedData(notebookDataRaw, notebooksFolder);

                this.addNotebook(notebook);
                storage.addNotebook(notebook);

            }
        }
    }

    private loadNotes():void
    {
        for(let a = 0;a < this._notebookList.length; ++a)
        {
            let notebook:Notebook = this._notebookList[a];

            let noteFolder = notebook.getNotesFolderPath();

            let files:string[] = [];

            try 
            {
                files = fs.readdirSync(noteFolder);
            }
            catch(e)
            {
                // File does not exist. No notes. Continue!
                continue;
            }

            // Load Notes
            for(let b = 0;b < files.length; ++b)
            {
                let notePath:string = files[b];

                if(Path.extname(notePath) !== ".json") 
                {
                    continue;
                }
                
                let noteDataRaw:any;
                
                try 
                {
                    
                    noteDataRaw = fs.readJsonSync(Path.join(noteFolder,notePath));
                }
                catch(e)
                {
                    Debug.logError("Load Notebook Failed: "+e);
                    continue;
                }

                let note:Note = Note.createFromSavedData(noteDataRaw, noteFolder);
                
                this.addNote(note);
                notebook.addNote(note);

                this._noteLoadedCount++;
            }
            
        }
    }
   
    ////////////////////
    // Storage Functions
    public addStorage(storage:NotebookStorage, saveApplicationData:boolean = true):boolean
    {
        if(this._storages[storage.id] == undefined)
        {
            for(let a = 0; a < this._storageList.length; ++a)
            {
                if(Path.normalize(this._storageList[a].folderPath) == Path.normalize(storage.folderPath))
                {
                    Debug.logError("Storage Already exist in that path");
                    return false;
                }
            }

            this._storages[storage.id] = storage;
            this._storageList.push(storage);
        
            if(saveApplicationData)
            {
                this.saveApplicationData();
            }
        }
        else
        {
            Debug.logError("Storage Already exist in the list");
            return false;
        }
        return true;
    }

    public saveStorage(storage:NotebookStorage, cascade:boolean = false):boolean
    {
        if(cascade)
        {
            for(let a = 0; a < storage.notebooks.length ;++a)
            {
                this.deleteNotebook(storage.notebooks[a], true);
            }
        }

        try 
        {
            fs.ensureDirSync(storage.folderPath);
            fs.writeJsonSync(storage.getFullPath(), storage.getSaveObject(),{spaces:4});
        }
        catch(e)
        {
            Debug.logError("Save Storage Failed: " + e);
            return false;
        }

        this.saveApplicationData();

        return true;
    }

    public getStorage(id:string):NotebookStorage
    {
        if(this._storages[id] != undefined)
        {
            return this._storages[id];
        }

        return null;
    }

    public deleteStorage(storage:NotebookStorage, cascade:boolean):boolean
    {
        if(this._storages[storage.id] != undefined)
        {
            // Delete Files
            try 
            {
                let path = storage.getFullPath();
                if(fs.lstatSync(path).isFile())
                {
                    fs.removeSync(path);
                }
            }
            catch(e)
            {
                Debug.logError("Delete Storage Failed: "+e);
                return false;
            }

            // Clear lists
            for(let a = 0;a < this._storageList.length ;++a)
            {
                if(this._storageList[a] == storage)
                {
                    this._storageList.splice(a,1);
                    break;
                }
            }

            delete this._storages[storage.id];

            // Delete Cascade
            if(cascade)
            {
                for(let a = 0;a < storage.notebooks.length ;++a)
                {
                    this.deleteNotebook(storage.notebooks[a], true);
                }
            }

            return true;
        }
        return false;
    }

    ///////////////////////
    // Notebook Functions
    public addNotebook(notebook:Notebook):boolean
    {
        if(this._notebooks[notebook.id] == undefined)
        {
            this._notebooks[notebook.id] = notebook;
            this._notebookList.push(notebook);
            return true;
        }
        return false;
    }

    public saveNotebook(notebook:Notebook, cascade:boolean = false):boolean
    {
        try 
        {
            fs.ensureDirSync(notebook.folderPath);

            fs.writeJsonSync(Path.join(notebook.folderPath, notebook.id + ".json"), notebook.getSaveObject(),{spaces:4});
        }
        catch(e)
        {
            Debug.logError("Save Note Failed: "+e);
            return false;
        }

        return true;
    }

    public getNotebook(id:string):Notebook
    {
        if(this._notebooks[id] != undefined)
        {
            return this._notebooks[id];
        }
        return null;
    }

    public deleteNotebook(notebook:Notebook, cascade:boolean = false):boolean
    {
        if(this._notebooks[notebook.id] != undefined)
        {
            for(let a = 0;a < this._notebookList.length ;++a)
            {
                if(this._notebookList[a] == notebook)
                {
                    this._storageList.splice(a,1);
                    break;
                }
            }

            delete this._notebooks[notebook.id];
            return true;
        }
        return false;
    }
    
    ////////////////////
    // Note Functions
    public addNote(note:Note):boolean
    {
        if(this._notebooks[note.id] == undefined)
        {
            this._notes[note.id] = note;
            return true;
        }
        return false;
    }

    public saveNote(note:Note):boolean
    {
        try 
        {
            fs.ensureDirSync(note.folderPath);
            fs.writeJsonSync(Path.join(note.folderPath,note.id + ".json"), note.getSaveObject(),{spaces:4});
            return true;
        }
        catch(e)
        {
            Debug.logError("Save Note Failed: "+e);
            return false;
        }
    }

    public getNote(id:string):Note
    {
        if(this._notes[id] != undefined)
        {
            return this._notes[id];
        }
        return null;
    }

    public deleteNote(note:Note):boolean
    {
        if(this._notes[note.id] != undefined)
        {
            delete this._notes[note.id];
            return true;
        }
        return false;
    }
}