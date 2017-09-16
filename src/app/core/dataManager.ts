
import { app} from "electron";
import * as path from "path";
import * as fs from "fs-extra";

import Debug from "../tools/debug";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

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
    private _noteStorages: Array<NotebookStorage> = new Array<NotebookStorage>();

    // Get/Set
    
    get noteStorages(): Array<NotebookStorage>  
    {
        Debug.log("noteStorages: DataManager");
        return this._noteStorages;
    }


    // Member Functions
    private constructor()
    {
        this._noteStorages = new Array<NotebookStorage>();
        this._savePath = path.join(app.getPath("userData"),this.sSaveFileName);
        
        Debug.log("Save File Location: "+this._savePath);

        this.checkStorageIntegrety();
    }

    private checkStorageIntegrety():void
    {
        Debug.log("Checking storage Integrety...");

        if(!this.loadStorages())
        {
            Debug.log("Creating new Storage File!");
            this.clearStorages();
            this.createStorages();
            this.saveStorages();
        }
    }
    
    private createStorages():void
    {
        this._noteStorages = new Array<NotebookStorage>();
    }

    private clearStorages():boolean
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

    public saveStorages():boolean
    {
        let storageInfo:any[] = [];
        
        for(let a = 0;a < this._noteStorages.length; ++a)
        {
            storageInfo.push(this._noteStorages[a].getFullPath());
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

    public loadStorages():boolean
    {
        return false;

    /*    try 
        {
            const dataRaw = fs.readJsonSync(this._savePath);

            // Save Update
            if(dataRaw.version != undefined)
            {
                if(dataRaw.version != this.sVersion)
                {
                    // Convert DataRaw
                    return false;
                }
            }

            // Load storage
            if(dataRaw.storages != undefined)
            {
                if(dataRaw.storages instanceof Array)
                {
                    this._noteStorages = new Array<NotebookStorage>();
                
                    for(var a = 0;a < dataRaw.storages.length; ++a)
                    {
                        let storage = dataRaw.storages[a];

                        let noteStorage:NotebookStorage = new NotebookStorage(storage.id,storage.path);
                        this._noteStorages.push(noteStorage);
                    }

                    for(var a = 0;a < this._noteStorages.length; ++a)
                    {
                        let noteStorage:NotebookStorage = this._noteStorages[a];
                    }
                
                }
            }

            return true;
        }
        catch(e)
        {
            Debug.logError("Load Storage Failed: "+e);
        }
        return false;*/
    }

    ////////////////////
    // Save Functions
    public addStorage(storage:NotebookStorage):boolean
    {
        for(let a = 0; a < this._noteStorages.length; ++a)
        {
            if(this._noteStorages[a].id == storage.id)
            {
                Debug.logError("ID already Exist in the storages");
                return false;
            }
        }

        let result:boolean = this.saveStorage(storage);

        if(result)
        {
            this._noteStorages.push(storage);
            this.saveStorages();
        }
       
        return result;
    }

    public getStorage(id:string):NotebookStorage
    {
        for(let a = 0; a < this._noteStorages.length; ++a)
        {
            if(this._noteStorages[a].id == id)
            {
                return this._noteStorages[a];
            }
        }
        return null;
    }

    public saveStorage(storage:NotebookStorage):boolean
    {
        let notebooks:Notebook[] = storage.notebooks;
        
        for(let a = 0;a < notebooks.length; ++a)
        {
            this.saveNotebook(notebooks[a]);
        }

        try 
        {
            fs.writeJsonSync(storage.getFullPath(), storage.getSaveObject(),{spaces:4});
        }
        catch(e)
        {
            Debug.logError("Save Note Failed: "+e);
            return false;
        }

        return true;
    }
    
    public saveNotebook(notebook:Notebook):boolean
    {
        let notes:Note[] = notebook.notes;

        for(let a = 0;a < notes.length; ++a)
        {
            this.saveNote(notes[a]);
        }

        try 
        {
            fs.writeJsonSync(notebook.path+"/"+notebook.id+".json", notebook.getSaveObject(),{spaces:4});
        }
        
        catch(e)
        {
            Debug.logError("Save Note Failed: "+e);
            return false;
        }

        return true;
    }


    public saveNote(note:Note):boolean
    {
        if(note.isDirty())
        {
            note.clearDirty();

            try 
            {
                fs.writeJsonSync(note.path, note);
                return true;
            }
            catch(e)
            {
                Debug.logError("Save Note Failed: "+e);
                return false;
            }
        }
        return true;
    }
}