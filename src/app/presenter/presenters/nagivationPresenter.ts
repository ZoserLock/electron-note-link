// Node.js
import {dialog}         from "electron"; 

import * as uuid        from "uuid/v4";
import * as Path        from "path";

// Tools
import Debug            from "tools/debug";

// Presenter
import Presenter        from "presenter/presenter";
import MessageChannel   from "presenter/messageChannel"

import NavigationPanelParser from "presenter/parsers/navigationItemParser";
import CoreStatusParser      from "presenter/parsers/coreStatusParser";

// Core
import DataManager      from "core/dataManager";
import Core             from "core/core";
import Storage          from "core/data/storage";
import Notebook         from "core/data/notebook";

export default class NavigationPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
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
        let storages = this._core.storageController.getStorages();

        let data =
        {
            storages: NavigationPanelParser.createNavigationData(storages),
            editorStatus: CoreStatusParser.createCoreStatus(this._core)
        }

        this._platform.sendUIMessage(MessageChannel.updateNavigationPanel, data);
    }

    ///////////////////////////
    // Storages

    private actionCreateNewStorage():void
    {
        this._core.storageController.createNewStorage();
    }

    private actionRemoveStorage(data:any):void
    {
        let storageId:string  = data.storage;

        this._core.storageController.removeStorage(storageId);
    }

    private actionDeleteStorage(data:any):void
    {
        let storageId:string = data.storage;

        this._core.storageController.deleteStorage(storageId);
    }
    
    ///////////////////////////
    // Notebook
     
    private actionNewNotebook(data:any):void
    {
        let storageId = data.storage;
        
        this._core.notebookController.createNewNotebook(storageId);
    }

    private actionRemoveNotebook(data:any):void
    {
        let notebookId = data.notebookId;
        
        this._core.notebookController.actionDeleteNotebook(notebookId);
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

        let notebook:Notebook = this._core.dataManager.getNotebook(notebookId);

        if(notebook != null)
        {
            this._core.dataManager.saveNotebook(notebook);
            this.update();
        }
        else
        {
            Debug.logError("actionChangeNotebookName: Notebook does not exist.");
        }
    };
}