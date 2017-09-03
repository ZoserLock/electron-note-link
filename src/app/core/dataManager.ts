
import { app} from 'electron'

import Debug from "../tools/debug"
import NoteStorage from "../notes/noteStorage"


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

    // Member Variables

    private _noteStorages: Array<NoteStorage> = new Array<NoteStorage>();

    // Member Functions
    private constructor()
    {
        this._noteStorages = new Array<NoteStorage>();
        Debug.log("storages path: "+app.getPath('userData'));
        Debug.logError("storages undefined ERROR");
      //  this.CheckStorageIntegrety();
    }


    private CheckStorageIntegrety():void
    {
        let storages:string = window.localStorage.getItem("nl-storages");

        if(storages === null || storages === "")
        {
            Debug.log("storages undefined");

        }

        for(let a = 0; a < this._noteStorages.length; ++a)
        {

        }
    }
    
    private CreateStorageDefinitions()
    {

    }

    public SaveNote():void
    {

    }
}