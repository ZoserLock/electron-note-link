
import { app} from "electron";
import * as path from "path";
import * as fs from "fs-extra";

import Debug from "../tools/debug";
import NotebookStorage from "../notes/notebookStorage";

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
            this.createStorageDefinitions();
            this.saveStorages();
        }
    }
    
    private createStorageDefinitions():void
    {
        this._noteStorages = new Array<NotebookStorage>();
        this._noteStorages.push(new NotebookStorage("Storage_001","Path01"));
        this._noteStorages.push(new NotebookStorage("Storage_002","Path013"));
        this._noteStorages.push(new NotebookStorage("Storage_003","Path014"));
    }

    public clearStorages():boolean
    {
        this._noteStorages = new Array<NotebookStorage>();

        try 
        {
            fs.removeSync(this._savePath);
            return true;
        }
        catch(e)
        {
            Debug.log("Clear Storage Failed: "+e);
            return false;
        }
    }

    public saveStorages():boolean
    {
        let saveFile:any =
        {
            version:1,
            storages:this._noteStorages,
        }

        try 
        {
            fs.writeJsonSync(this._savePath,saveFile);
            return true;
        }
        catch(e)
        {
            Debug.log("Save Storage Failed: "+e);
            return false;
        }
    }

    public loadStorages():boolean
    {

        try 
        {
            const dataRaw = fs.readJsonSync(this._savePath);
            // Save Update
            if(dataRaw.version != undefined)
            {
                if(dataRaw.version != this.sVersion)
                {
                    // Convert DataRaw
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

                        let noteStorage:NotebookStorage = new NotebookStorage(storage._id,storage._path);
                        this._noteStorages.push(noteStorage);
                    }

                    for(var a = 0;a < this._noteStorages.length; ++a)
                    {
                        let noteStorage:NotebookStorage = this._noteStorages[a];
                        Debug.log(noteStorage.GetName());
                    }
                
                }
            }
            return true;
        }
        catch(e)
        {
            Debug.log("Load Storage Failed: "+e);
        }
        return false;
    }

    public saveNote():void
    {

    }
}