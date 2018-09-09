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
import Notebook         from "core/data/notebook";

export default class NotebookController
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

    public createNewNotebook(storageId:string):boolean
    {
        let storage:Storage = this._core.dataManager.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), Path.join(storage.folderPath,"/notebooks"));

            if(this._dataManager.saveNotebook(notebook))
            {
                this._dataManager.addNotebook(notebook);
                storage.addNotebook(notebook);
                this._dataManager.saveStorage(storage);
            }

            this._presentation.updateNavigationPanel();
            return true;
        }
        else
        {
            Debug.logError("[Notebook Controller] Create new Notebook: Parent Storage Id does not exist");
            return false;
        }
    }

    public deleteNotebook(notebookId:string):void // TODO Add callback?
    {
        let notebook:Notebook = this._core.dataManager.getNotebook(notebookId);

        if(notebook != null)
        {
            this._core.popupController.showConfirmationPanel("Delete Notebook?","", "Are you sure you want to delete this notebook. This operation cannot be undone.","Yes","Cancel",()=>
            {
                let isSelectedNotebook = (this._core.selectedNotebook == notebook);
                let hasSelectedNote = (this._core.selectedNote.parent == notebook);
                
                this._dataManager.deleteNotebook(notebook);

                this._presentation.updateNavigationPanel();
    
                if(isSelectedNotebook)
                {
                    if(this._core.dataManager.notebooks.length > 0)
                    {
                        let next:Notebook = this._core.dataManager.notebooks[0];
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
            Debug.logError("[Notebook Controller] Delete Notebook: Notebook does not exist.");
        }
    }

    public updateNotebook(notebookUpdate:NotebookUpdateData):boolean
    {
        let notebook:Notebook = this._dataManager.getNotebook(notebookUpdate.id);

        if(notebook != null)
        {
            if(notebook.applyUpdateData(notebookUpdate))
            {
                this._dataManager.saveNotebook(notebook);
                this._presentation.updateNavigationPanel();
                return true;
            }
        }
        else
        {
            Debug.logError("[Notebook Controller] UpdateNotebook: Notebook does not exist.");
        }
        return false;
    }
}
