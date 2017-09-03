
import { app} from "electron";
import * as path from "path";
import * as fs from "fs-extra";

import Debug from "../tools/debug";
import NoteStorage from "../notes/noteStorage";

export default class DataManager
{
    // Singleton 
    private static sInstance:DataManager;

    static get instance(): DataManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new DataManager();
    }
    // Static variables
    private sSaveFileName:string = "data.json";
    private sVersion:number = 1;

    // Member Variables
    private _savePath:string;
    private _noteStorages: Array<NoteStorage> = new Array<NoteStorage>();

    // Member Functions
    private constructor()
    {
        this._noteStorages = new Array<NoteStorage>();
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
        this._noteStorages = new Array<NoteStorage>();
        this._noteStorages.push(new NoteStorage("Storage_001","Path01"));
        this._noteStorages.push(new NoteStorage("Storage_002","Path013"));
        this._noteStorages.push(new NoteStorage("Storage_003","Path014"));
    }

    public clearStorages():boolean
    {
        this._noteStorages = new Array<NoteStorage>();

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
                if(dataRaw.version!=this.sVersion)
                {
                    // Convert DataRaw
                }
            }

            // Load storage
            if(dataRaw.storages != undefined)
            {
                if(dataRaw.storages instanceof Array)
                {
                    this._noteStorages = new Array<NoteStorage>();
                
                    for(var a = 0;a < dataRaw.storages.length; ++a)
                    {
                        let storage = dataRaw.storages[a];

                        let noteStorage:NoteStorage = new NoteStorage(storage._id,storage._path);
                        this._noteStorages.push(noteStorage);
                    }

                    for(var a = 0;a < this._noteStorages.length; ++a)
                    {
                        let noteStorage:NoteStorage = this._noteStorages[a];
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