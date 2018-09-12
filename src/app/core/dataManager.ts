
// Node Modules
import { app, ipcMain,BrowserWindow} from "electron";
import * as Path from "path";
import * as fs from "fs-extra";

// Tools
import Debug     from "tools/debug";
import FileTools from "tools/fileTools";

// Core
import Storage  from "core/data/storage";
import Notebook from "core/data/notebook";
import Note     from "core/data/note";

export default class DataManager
{
    // Static variables
    private sSaveFileName:string = "data.json";
    private sVersion:number = 1;

    // Member Variables
    private _savePath:string;

    private _storageList: Array<Storage>    = new Array<Storage>();
    private _notebookList: Array<Notebook>  = new Array<Notebook>();
    private _noteList: Array<Note>          = new Array<Note>();

    // Data maps
    private _storages: Dictionary<Storage>   = {};
    private _notebooks: Dictionary<Notebook> = {};
    private _notes: Dictionary<Note>         = {};

    // Cache
    private _cacheWindow:BrowserWindow;

    // Get/Set
    
    get noteStorages(): Array<Storage>  
    {
        return this._storageList;
    }

    get notebooks(): Array<Notebook>  
    {
        return this._notebookList;
    }

    get notes(): Array<Note>  
    {
        return this._noteList;
    }

    // Member Functions
    public constructor()
    {
        this._storageList = new Array<Storage>();
        this._savePath = Path.join(app.getPath("userData"),this.sSaveFileName);
        
        Debug.log("[DataManager] Save File Location: "+this._savePath);
    }

    // data Management
    private registerStorage(storage:Storage):void
    {
        this._storages[storage.id] = storage;
        this._storageList.push(storage);
    }

    private unregisterStorage(storage:Storage):void
    {
        delete this._storages[storage.id];

        for(let a = 0;a < this._storageList.length ;++a)
        {
            if(this._storageList[a] == storage)
            {
                this._storageList.splice(a,1);
                break;
            }
        }
    }

    private registerNotebook(notebook:Notebook):void
    {
        this._notebooks[notebook.id] = notebook;
        this._notebookList.push(notebook);
    }
    
    private unregisterNotebook(notebook:Notebook):void
    {
        for(let a = 0;a < this._notebookList.length ;++a)
        {
            if(this._notebookList[a] == notebook)
            {
                this._notebookList.splice(a,1);
                break;
            }
        }

        delete this._notebooks[notebook.id];
    }

    private registerNote(note:Note):void
    {
        this._notes[note.id] = note;
        this._noteList.push(note);
    }

    private unegisterNote(note:Note):void
    {
        for(let a = 0;a < this._noteList.length ;++a)
        {
            if(this._noteList[a] == note)
            {
                this._noteList.splice(a,1);
                break;
            }
        }

        delete this._notes[note.id];
    }
    
    // data Management

    public checkStorageIntegrety():void
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
        this._storageList  = new Array<Storage>();
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
        let dataRaw = FileTools.readJsonSync(this._savePath);

        if(dataRaw == null)
        {
            Debug.logError("Failed To load Application Data");
            return false;
        }

        if(!this.validateApplicationData(dataRaw))
        {
            Debug.logError("Application Data is invalid");
            return false;
        }

        let converted = this.updateApplicationData(dataRaw);

        let notesLoaded:number = 0;

        for(var a = 0;a < dataRaw.storages.length; ++a)
        {
            let storagePath = dataRaw.storages[a];
            let loadedStorage = this.loadStorage(storagePath);

            if(loadedStorage != null)
            {
                this.addStorage(loadedStorage);
                notesLoaded += loadedStorage.getNoteCount();
            }
        }

        this.saveApplicationData();

       /* for(var a = 0;a < this._storageList.length; ++a)
        {
            for(var b = 0;b< this._storageList[a].notebooks.length; ++b)
            {
                this.saveNotebook(this._storageList[a].notebooks[b]);
            }
        }*/

        Debug.log("Notes Loaded: "+notesLoaded);
        console.timeEnd("load App Data");
        return true;
    }

    private validateApplicationData(dataRaw:any):boolean
    {
        return true;
    }

    private updateApplicationData(dataRaw:any):boolean
    {
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
        return true;
    }

    //////////////////////////////
    // Storage  Utility Functions
    public isLocationStorage(path:string):boolean
    {
        let storagePath = Path.join(path,"notelink.json");

        if (fs.existsSync(storagePath)) 
        { 
            try 
            {
                let storage = fs.readJsonSync(storagePath);
                if(storage.id != undefined)
                {
                    if(storage.name != undefined)
                    {
                        return true;
                    }
                }
            }
            catch(e)
            {
                Debug.logError("Read Storage Folder Failed for Notebook: Error:"+ e);
                return false;
            }
        }

        return false;
    }

    public canUseStorageLocation(path:string):boolean
    {
        let files:string[] = [];

        if(!Path.isAbsolute(path)) 
        {
            Debug.logError("Invalid Path: "+path);
            return false;
        }

        try 
        {
            files = fs.readdirSync(path);
        }
        catch(e)
        {
            Debug.logError("Read Storage Folder Failed for Notebook: Error:"+ e);
            return false;
        }

        if(files.length > 0)
        {
            Debug.logError("The folder must be empty");
            return false;
        }

        return true;
    }

    public hasStorageWithPath(path:string):boolean
    {
        for(let a = 0; a < this._storageList.length; ++a)
        {
            if(Path.normalize(this._storageList[a].folderPath) == Path.normalize(path))
            {
                Debug.logError("Storage Already exist in that path");
                return true;
            }
        }
        
        return false;
    }

    /////////////////////
    // Storage  Functions
    public addStorage(storage:Storage):boolean
    {
        if(this._storages[storage.id] == undefined)
        {
            if(this.hasStorageWithPath(storage.folderPath))
            {
                Debug.logError("Storage Already exist with that path");
                return false;
            }

            this.registerStorage(storage);

 
            if(storage.notebooks.length > 0)
            {
                for(let a = 0;a < storage.notebooks.length ;++a)
                {
                    this.addNotebook(storage.notebooks[a]);
                }
            }

            this.saveApplicationData();
        }
        else
        {
            Debug.logError("Storage Already exist in the list");
            return false;
        }
        return true;
    }

    public getStorage(id:string):Storage
    {
        if(this._storages[id] != undefined)
        {
            return this._storages[id];
        }

        return null;
    }

    public loadStorage(path:string):Storage
    {
        let storageDataRaw = FileTools.readJsonSync(path);
  
        if(storageDataRaw == null)
        {
            Debug.logError("Load Storage Json Failed");
            return null;
        }

        let noteStorage:Storage   = Storage.createFromSavedData(storageDataRaw, Path.dirname(path));
        let notebookStorageFolder = noteStorage.getNotebooksFolderPath();

        // Load Notebooks
        let storageNotebookFiles:string[] = FileTools.getJsonFilesInFolder(notebookStorageFolder);
        
        if(storageNotebookFiles != null)
        {
            for(let b = 0;b < storageNotebookFiles.length; ++b)
            {
                let notebook = this.loadNotebook(storageNotebookFiles[b]);

                if(notebook != null)
                {
                    noteStorage.addNotebook(notebook);
                }
                else
                {
                    Debug.logError("Failed to create notebook from json in storage folder. Skipping...");
                }
            }
        }

        return noteStorage;
    }

    public saveStorage(storage:Storage, cascade:boolean = false):boolean
    {
        if(cascade)
        {
            for(let a = 0; a < storage.notebooks.length ;++a)
            {
                this.saveNotebook(storage.notebooks[a], cascade);
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

    public removeStorage(storage:Storage):boolean
    {
        if(this._storages[storage.id] != undefined)
        {
            for(let a = 0; a < storage.notebooks.length; ++a)
            {
                this.removeNotebook(storage.notebooks[a]);
            }

            this.unregisterStorage(storage);

            this.saveApplicationData();
        }
        return false;
    }

    public deleteStorage(storage:Storage):boolean
    {
        if(this._storages[storage.id] != undefined)
        {
            let path = storage.getFullPath();
            if(!FileTools.deleteJsonFile(path))
            {
                Debug.logError("[Data Manager] deleteStorage: Unable to delete Storage Json File. Aborting.");
                return false;
            }

            this.unregisterStorage(storage);
            let notebooks = storage.notebooks.slice();
            Debug.log("[Data Manager] deleteStorage: Deleting  "+storage.notebooks.length+" Notebooks");

            for(let a = 0;a < notebooks.length ;++a)
            {
                Debug.log("[Data Manager] deleteStorage: Deleting Related Notebook: "+notebooks[a].name);
                this.deleteNotebook(notebooks[a]);
            }

            FileTools.deleteFolder(storage.getNotebooksFolderPath());
            
            return true;
        }
        else
        {
            Debug.logError("[Data Manager] deleteStorage: Trying to delete an unexistent storage.");
        }
        return false;
    }

    ///////////////////////

    public addNotebook(notebook:Notebook):boolean
    {
        if(this._notebooks[notebook.id] == undefined)
        {
            this.registerNotebook(notebook);

            if(notebook.notes.length > 0)
            {
                for(let a = 0;a < notebook.notes.length ;++a)
                {
                    this.addNote(notebook.notes[a]);
                }
            }

            return true;
        }
        return false;
    }

    public getNotebook(id:string):Notebook
    {
        if(this._notebooks[id] != undefined)
        {
            return this._notebooks[id];
        }
        return null;
    }
    
    public loadNotebook(path:string):Notebook
    {
        let notebookRaw = FileTools.readJsonSync(path);
  
        if(notebookRaw == null)
        {
            Debug.logError("Load Notebook Json Failed");
            return null;
        }

        let notebook:Notebook = Notebook.createFromSavedData(notebookRaw, Path.dirname(path));
        let notebookNoteFolder:string = notebook.getNotesFolderPath();

        // This can removed later.
        // Load Notes
        let noteFiles:string[] = FileTools.getJsonFilesInFolder(notebookNoteFolder);
        
        if(noteFiles != null)
        {
            // Load Notes
            for(let b = 0;b < noteFiles.length; ++b)
            {
                let note = this.loadNote(noteFiles[b]);

                if(note != null)
                {
                    notebook.addNote(note);
                }
                else
                {
                    Debug.logError("Failed to create notebook from json in storage folder. Skipping...");
                }
            }
        }

        return notebook;
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

  
    private removeNotebook(notebook:Notebook):boolean
    {
        if(this._notebooks[notebook.id] != undefined)
        {
            for(let a = 0; a < notebook.notes.length; ++a)
            {
                this.removeNote(notebook.notes[a]);
            }

            this.unregisterNotebook(notebook);
            return true;
        }
        return false;
    }

    public deleteNotebook(notebook:Notebook):boolean
    {
        if(this._notebooks[notebook.id] != undefined) // [TODO CHECK if is necesary to get the value from the dictionary]
        {
            let path = notebook.getFullPath();
            
            if(!FileTools.deleteJsonFile(path))
            {
                Debug.logError("[Data Manager] deleteNotebook: Unable to delete Notebook Json File. Aborting.");
                return false;
            }

            let notes = notebook.notes.slice();
            Debug.log("[Data Manager] deleteNotebook: Deleting  "+notebook.notes.length+" Notes");

            for(let a = 0; a < notes.length ;++a)
            {
                Debug.log("[Data Manager] deleteNotebook: Deleting Related Note: "+notes[a].title);
                this.deleteNote(notes[a]);
            }

            notebook.removeFromParent();

            FileTools.deleteFolder(notebook.getNotesFolderPath());

            this.unregisterNotebook(notebook);
            
            return true;
        }
        else
        {
            Debug.logError("[Data Manager] deleteNotebook: Trying to delete an unexistent notebook.");
        }
        return false;
    }
    
    ////////////////////
    // Note Functions
    public addNote(note:Note):boolean
    {
        if(this._notebooks[note.id] == undefined)
        {
            //if note is unloaded add to a temporal list.
            this.registerNote(note);
            return true;
        }
        return false;
    }

    public getNote(id:string):Note
    {
        if(this._notes[id] != undefined)
        {
            return this._notes[id];
        }
        return null;
    }

    public saveNote(note:Note):boolean
    {
        note.updateDates();
        try 
        {
            fs.ensureDirSync(note.folderPath);
            fs.writeJsonSync(note.getFullPath(), note.getSaveObject(),{spaces:4});
            return true;
        }
        catch(e)
        {
            Debug.logError("Save Note Failed: "+e);
            return false;
        }
    }

    public loadNote(path:string):Note
    {
        let noteDataRaw:any = FileTools.readJsonSync(path);

        let note:Note = Note.createFromSavedData(noteDataRaw, Path.dirname(path));
        
        return note; 
    }

    private removeNote(note:Note):boolean
    {
        if(this._notes[note.id] != undefined)
        {
            this.unegisterNote(note);
            return true;
        }
        return false;
    }

    public deleteNote(note:Note):boolean
    {
        if(this._notes[note.id] != undefined)
        {
            let path = note.getFullPath();
            
            if(!FileTools.deleteJsonFile(path))
            {
                return false;
            }

            note.removeFromParent();
            this.unegisterNote(note);
            return true;
        }
        return false;
    }
}