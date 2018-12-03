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

    private _noteLinkFileName ="notelink.json";
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

                    this._core.popupController.showInfoPanel("Storage Creation","Storage Name",
                    "Can't add storage from that location or that storage is already in use \n Please select another folder",
                    "Ok",null);
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

                    this._presentation.onceNextFrame(()=>
                    {
                        this._presentation.scrollToStorage(storage.id);
                    });
                }
                else
                {
                    Debug.logError("[Storage Controller] Can't use that location as storage location");

                    this._core.popupController.showInfoPanel("Storage Creation","Storage Name",
                    "Can't use that location as storage location \n Please select another folder",
                    "Ok",null);
                }
            }
        }
    }
    
    private addExistingStorage(path:string):boolean
    {
        if(this._core.dataManager.hasStorageWithPath(path))
        {
            Debug.logError("[Storage Controller] Already have that storage");
            return false;
        }

        let storagePath = Path.join(path,this._noteLinkFileName);
        let storage = this._core.dataManager.loadStorage(storagePath);

        if(storage != null)
        {
            if(this._core.dataManager.addStorage(storage))
            {
                this._presentation.updateNavigationPanel();

                this._presentation.onceNextFrame(()=>
                {
                    this._presentation.scrollToStorage(storage.id);
                });

                return true;
            }
        }

        return false;
    }

    public updateStorage(storageUpdate:StorageUpdateData):boolean
    {
        let storage:Storage = this._dataManager.getStorage(storageUpdate.id);

        if(storage != null)
        {
            if(storage.applyUpdateData(storageUpdate))
            {
                this._dataManager.saveStorage(storage);

                this._presentation.updateNavigationPanel();
    
                return true;
            }
        }
        else
        {
            Debug.logError("[Note Controller] Update Note: Note does not exist.");
        }
        return false;
    }

    public removeStorage(storageId:string):void
    {
        this._core.popupController.showConfirmationPanel("Remove selected Storage?","Storage Name",
        "Are you sure want to remove the storage? \n All data within storage folder will be still be available in the file explorer",
        "Remove","Cancel",
        ()=>
        {
                let storage:Storage = this._core.dataManager.getStorage(storageId);

                if(storage != null)
                {
                    this._core.notifyStorageRemoved(storage);
                    
                    this._dataManager.removeStorage(storage);

                    this._presentation.updatePresentation();
                }
                else
                {
                    Debug.logError("[Storage Controller] removeStorage: Storage does not exist.");
                }
        },
        ()=>
        {
            Debug.logError("[Storage Controller] removeStorage: Cancelled By User");
        });
    }

    public deleteStorage(storageId:string):void
    {
        this._core.popupController.showConfirmationPanel("Delete selected Storage?","Storage Name",
                                                         "Are you sure want to delete the storage? \n All data within storage folder will be lost.",
                                                         "Delete","Cancel",
        ()=>
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
    
                this._dataManager.deleteStorage(storage);
                
                this._presentation.updatePresentation();
            }
            else
            {
                Debug.logError("[Storage Controller] deleteStorage: Storage does not exist.");
            }
        },
        ()=>
        {
            Debug.logError("[Storage Controller] deleteStorage: Cancelled By User");
        });
    }

    
    public renameStorage(id:string):void
    {
        let storage = this._core.dataManager.getStorage(id);

        if(storage != null)
        {
            this._core.popupController.showInputPanel("Storage Rename","Type a new name", storage.name,"Rename","Cancel",(data:any)=>
            {
                let updateData:StorageUpdateData = {
                    id:storage.id,
                    name:data.text
                }

                this.updateStorage(updateData);
                
            },null);
        }
    }

}
