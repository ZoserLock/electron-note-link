// Node Modules
import * as uuid from "uuid/v4";
import * as Path from "path";

// Tools
import Debug     from "tools/debug";

// Core
import Core             from "core/core";
import Platform         from "core/platform";
import Presentation     from "core/presentation";
import DataManager      from "core/dataManager";

import Storage          from "core/data/storage";

export default class StorageController
{
    // Dependencies
    private _core:Core;
    private _platform:Platform;
    private _presentation:Presentation;
    private _dataManager:DataManager;

    // State?

    constructor(core:Core, platform:Platform, presentation:Presentation, dataManager:DataManager)
    {
        this._core         = core;
        this._presentation = presentation;
        this._platform     = platform;
        this._dataManager  = dataManager;
    }

    public getStorages(): Storage[] 
    {
        return this._core.dataManager.noteStorages;
    }

    public createNewStorage():void
    {
        let storagePath:string = this._platform.showOpenDirectoryDialog("Create new Storage");

        if(storagePath != null)
        {
            if(this._dataManager.isLocationStorage(storagePath))
            {
                Debug.log("[Storage Controller] Target location is an storage location. Using location.");
                if(!this.addExistingStorage(storagePath))
                {
                    Debug.logError("[Storage Controller] Can't add existing storage from that location");
                    //TODO Show errror in a popup
                }
            }
            else
            {
                if(this._core.dataManager.canUseStorageLocation(storagePath))
                {
                    Debug.log("[Storage Controller] Target location is empty. Creating a new Storage.");
                    // Create new Storage
                    let storage = Storage.create(uuid(), storagePath);

                    this._dataManager.addStorage(storage);
                    this._dataManager.saveStorage(storage);
            
                    this._presentation.updateNavigationPanel();
                }
                else
                {
                    Debug.logError("[Storage Controller] Can't use that location as storage location");
                    //TODO Show errror in a popup
                }
            }
        }
    }
    
    private addExistingStorage(path:string):boolean
    {
        if(this._core.dataManager.hasStorageWithPath(path)) //TODO Check the id too
        {
            Debug.logError("[Storage Controller] Already have that storage");
            return false;
        }

        let storagePath = Path.join(path,"notelink.json");//TODO put that in a variable
        let storage = this._core.dataManager.loadStorage(storagePath);

        if(storage != null)
        {
            if(this._core.dataManager.addStorage(storage))
            {
                this._presentation.updateNavigationPanel();
                return true;
            }
        }

        return false;
    }

    public removeStorage(storageId:string):boolean
    {
        let storage:Storage = this._core.dataManager.getStorage(storageId);

        if(storage != null)
        {
            // TODO Move this logic to core. something like this._core.checkSelectedNotebook.
            if(this._core.selectedNotebook != null && this._core.selectedNotebook.storage == storage)
            {
                Debug.log("Unselect notebook");
                this._core.unselectNotebook();
            }

            if(this._core.selectedNote != null && this._core.selectedNote.parent.storage == storage)
            {
                Debug.log("Unselect note");
                this._core.unselectNote();
            }

            this._core.dataManager.removeStorage(storage);

            this._core.updateAllPanels();
            return true;
        }
        else
        {
            Debug.logError("[Storage Controller] removeStorage: Storage does not exist.");
            return false;
        }
    }

    public deleteStorage(storageId:string):boolean
    {
        let storage:Storage  = this._core.dataManager.getStorage(storageId);

        if(storage != null)
        {
            if(this._core.selectedNotebook != null && this._core.selectedNotebook.storage == storage)
            {
                Debug.log("Unselect notebook");
                this._core.unselectNotebook();
            }

            if(this._core.selectedNote != null && this._core.selectedNote.parent.storage == storage)
            {
                Debug.log("Unselect note");
                this._core.unselectNote();
            }

            this._core.dataManager.deleteStorage(storage);

            this._core.updateAllPanels();

            return true;
        }
        else
        {
            Debug.logError("[Storage Controller] deleteStorage: Storage does not exist.");
            return false;
        }
    }

}
