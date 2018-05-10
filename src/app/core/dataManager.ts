
import { app} from "electron";
import * as Path from "path";
import * as fs from "fs-extra";


import Debug from "../tools/debug";
import FileTools from "../tools/fileTools";

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

interface TagMap 
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
    private _notePerTag: TagMap = {}

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
    public addStorage(storage:NotebookStorage, saveApplicationData:boolean = true):boolean
    {
        if(this._storages[storage.id] == undefined)
        {
            if(this.hasStorageWithPath(storage.folderPath))
            {
                Debug.logError("Storage Already exist with that path");
                return false;
            }

            this._storages[storage.id] = storage;
            this._storageList.push(storage);
        
            if(storage.notebooks.length > 0)
            {
                for(let a = 0;a < storage.notebooks.length ;++a)
                {
                    this.addNotebook(storage.notebooks[a]);
                }
            }

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

    public getStorage(id:string):NotebookStorage
    {
        if(this._storages[id] != undefined)
        {
            return this._storages[id];
        }

        return null;
    }

    public loadStorage(path:string):NotebookStorage
    {
        let storageDataRaw = FileTools.readJsonSync(path);
  
        if(storageDataRaw == null)
        {
            Debug.logError("Load Storage Json Failed");
            return null;
        }

        let noteStorage:NotebookStorage = NotebookStorage.createFromSavedData(storageDataRaw, Path.dirname(path));
        let notebookStorageFolder= noteStorage.getNotebooksFolderPath();

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

    public saveStorage(storage:NotebookStorage, cascade:boolean = false):boolean
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

    public removeStorage(storage:NotebookStorage):boolean
    {
        if(this._storages[storage.id] != undefined)
        {
            let toRemoveStorage = this._storages[storage.id];

            for(let a = 0; a < toRemoveStorage.notebooks.length; ++a)
            {
                this.removeNotebook(toRemoveStorage.notebooks[a]);
            }

            for(let a = 0;a < this._storageList.length ;++a)
            {
                if(this._storageList[a] == storage)
                {
                    this._storageList.splice(a,1);
                    break;
                }
            }

            delete this._storages[storage.id];

           
            this.saveApplicationData();
        }
        return false;
    }

    public deleteStorage(storage:NotebookStorage, cascade:boolean):boolean
    {
        if(this._storages[storage.id] != undefined)
        {
            // Delete Files [TODO] Pass to filetools
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

  
    public removeNotebook(notebook:Notebook):boolean
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

    public deleteNotebook(notebook:Notebook, cascade:boolean = false):boolean
    {
        if(this._notebooks[notebook.id] != undefined)
        {
            let toRemoveNotebook = this._notebooks[notebook.id];

            for(let a = 0;a < toRemoveNotebook.notes.length ;++a)
            {
                this.removeNote(toRemoveNotebook.notes[a]);
            }

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
            //if note is unloaded add to a temporal list.
            this._notes[note.id] = note;
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

    public loadNote(path:string):Note
    {
        let noteDataRaw:any = FileTools.readJsonSync(path);

        let note:Note = Note.createFromSavedData(noteDataRaw, Path.dirname(path));
        
        return note; 
    }
  
    public removeNote(note:Note):boolean
    {
        if(this._notes[note.id] != undefined)
        {
            delete this._notes[note.id];
            return true;
        }
        return false;
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