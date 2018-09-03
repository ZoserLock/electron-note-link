// Node.js
import {dialog}         from "electron"; 

import * as uuid        from "uuid/v4";
import * as Path        from "path";

// Tools
import Debug            from "tools/debug";

// Presenter
import Presenter        from "presenter/presenter";
import MessageChannel   from "presenter/messageChannel"

// Core
import DataManager      from "core/dataManager";
import Core             from "core/core";
import Storage          from "core/data/storage";
import Notebook         from "core/data/notebook";

// Move later
import PopupManager     from "core/popupManager";

export default class NavigationPresenter extends Presenter
{

    private _updates:number = 0;

    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.updateNavigationPanel    ,(data:any) => this.update());

        this.registerUIListener(MessageChannel.createStorage      ,(data:any) => this.actionCreateNewStorage());

        this.registerUIListener(MessageChannel.removeStorage      ,(data:any) => this.actionRemoveStorage(data));
        this.registerUIListener(MessageChannel.deleteStorage      ,(data:any) => this.actionDeleteStorage(data));
        this.registerUIListener(MessageChannel.removeNotebook     ,(data:any) => this.actionRemoveNotebook(data));

        this.registerUIListener(MessageChannel.createNotebook     ,(data:any) => this.actionNewNotebook(data));
        this.registerUIListener(MessageChannel.selectNotebook     ,(data:any) => this.actionSelectNotebook(data));
        this.registerUIListener(MessageChannel.setNoteListMode    ,(data:any) => this.actionSetNoteListMode(data));
    }

    public onUpdateRequested():void
    {
        Debug.log("onUpdateRequested: "+this._updates);

        this._updates++;

        let storages:Storage[] = DataManager.instance.noteStorages;

        let storagesData:any[] = storages.map((storage:Storage) =>
        {
            return storage.GetDataObject();
        });

        let editorData:any = this._core.getEditorStatusData();

        let sendData =
        {
            storages: storagesData,
            editorStatus: editorData
        }

        this._platform.sendUIMessage(MessageChannel.updateNavigationPanel, sendData);
    }

    ///////////////////////////
    // Storages

    private actionCreateNewStorage():void
    {
        let targetPath = dialog.showOpenDialog({title:"Create new Storage",properties:["openDirectory"]});

        if(targetPath != null && targetPath.length > 0)
        {
            let storagePath = targetPath[0];

            if(DataManager.instance.isLocationStorage(storagePath))
            {
                if(!this.addExistingStorage(storagePath))
                {
                    Debug.logError("Can't add existing storage from that location");
                }
            }
            else
            {
                if(DataManager.instance.canUseStorageLocation(storagePath))
                {
                    this.createNewStorage(storagePath);
                }
                else
                {
                    Debug.logError("Can't use that location as storage location");
                    //Show errror
                }
            }
        }
    }

    private createNewStorage(path:string):void
    {
        let storage = Storage.create(uuid(), path);

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        this.update();
    }
    
    private addExistingStorage(path:string):boolean
    {
        Debug.logError("addExistingNotebookStorage: "+path);

        if(  DataManager.instance.hasStorageWithPath(path)) // I can check the id too
        {
            Debug.logError("Already have that storage");
            return false;
        }

        let storagePath = Path.join(path,"notelink.json");
        let storage = DataManager.instance.loadStorage(storagePath);

        if(storage != null)
        {
            if(DataManager.instance.addStorage(storage))
            {
                this.update();
                return true;
            }
        }

        return false;
    }

    private actionRemoveStorage(data:any):void
    {
        let storageId:string    = data.storage;
        let storage:Storage     = DataManager.instance.getStorage(storageId);

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

            DataManager.instance.removeStorage(storage);

            this._core.updateAllPanels();
        }
        else
        {
            Debug.logError("actionRemoveStorage: Storage does not exist.");
        }
    }

    private actionDeleteStorage(data:any):void
    {
        let storageId:string = data.storage;
        let storage:Storage  = DataManager.instance.getStorage(storageId);

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

            DataManager.instance.deleteStorage(storage);

            this._core.updateAllPanels();
        }
        else
        {
            Debug.logError("actionRemoveStorage: Storage does not exist.");
        }
    }
    ///////////////////////////
    // Notebook
     
    private actionNewNotebook(data:any):void
    {
        let storageId = data.storage;

        let storage:Storage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), Path.join(storage.folderPath,"/notebooks"));

            if(DataManager.instance.saveNotebook(notebook))
            {
                DataManager.instance.addNotebook(notebook);
                storage.addNotebook(notebook);
                DataManager.instance.saveStorage(storage);
            }

            this.update();
        }
        else
        {
            Debug.logError("storage does not exist");
        }
    }

    private actionRemoveNotebook(data:any):void
    {
        let notebookId = data.notebookId;

        let notebook:Notebook = DataManager.instance.getNotebook(notebookId);

        if(notebook != null)
        {
            PopupManager.instance.showConfirmationPanel("Delete Notebook?","", "Are you sure you want to delete this notebook. This operation cannot be undone.","Yes","Cancel",()=>
            {
                let isSelectedNotebook = (this._core.selectedNotebook == notebook);
                let hasSelectedNote = (this._core.selectedNote.parent == notebook);
                
                DataManager.instance.deleteNotebook(notebook);

                this.update();
    
                if(isSelectedNotebook)
                {
                    if(DataManager.instance.notebooks.length > 0)
                    {
                        let next:Notebook = DataManager.instance.notebooks[0];
                        this._core.selectNotebook(next.id);
                    }
                    else
                    {
                        this._core.unselectNotebook();
                    }
                }
            },null);

        }
        else
        {
            Debug.logError("actionRemoveStorage: Storage does not exist.");
        }
    }

    private actionSetNoteListMode(data:any):void
    {
        this._core.setNoteListMode(data.mode);
    }
    
    private actionSelectNotebook(data:any)
    {
        this._core.selectNotebook(data.notebookId);
    };
    
    private actionChangeNotebookName(data:any)
    {
        let notebookId = data.notebookId;
        let newName    = data.name;

        let notebook:Notebook = DataManager.instance.getNotebook(notebookId);

        if(notebook != null)
        {
            DataManager.instance.saveNotebook(notebook);
            this.update();
        }
        else
        {
            Debug.logError("actionChangeNotebookName: Notebook does not exist.");
        }
    };
}