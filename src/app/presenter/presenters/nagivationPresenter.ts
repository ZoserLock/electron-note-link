// Presenter
import Presenter             from "presenter/presenter";
import MessageChannel        from "presenter/messageChannel"

import StorageDataParser  from "presenter/parsers/storageDataParser";
import CoreStatusParser   from "presenter/parsers/coreStatusParser";

export default class NavigationPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.createStorage      ,(data:any) => this.actionCreateNewStorage());

        this.registerUIListener(MessageChannel.removeStorage      ,(data:any) => this.actionRemoveStorage(data));
        this.registerUIListener(MessageChannel.deleteStorage      ,(data:any) => this.actionDeleteStorage(data));
        this.registerUIListener(MessageChannel.updateStorage      ,(data:any) => this.actionUpdateStorage(data));

        this.registerUIListener(MessageChannel.deleteNotebook     ,(data:any) => this.actionDeleteNotebook(data));
        this.registerUIListener(MessageChannel.createNotebook     ,(data:any) => this.actionNewNotebook(data));
        this.registerUIListener(MessageChannel.selectNotebook     ,(data:any) => this.actionSelectNotebook(data));

        this.registerUIListener(MessageChannel.setNoteListMode    ,(data:any) => this.actionSetNoteListMode(data));

        this.registerUIListener(MessageChannel.viewNotebookSource ,(data:any) => this.actionViewNotebookSource(data));
    }

    public onUpdateRequested():void
    {
        let storages = this._core.storageController.getStorages();

        let data =
        {
            storages: StorageDataParser.createStorageListData(storages),
            status: CoreStatusParser.createCoreStatus(this._core)
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
        let storageId:string  = data.storageId;

        this._core.storageController.removeStorage(storageId);
    }

    private actionDeleteStorage(data:any):void
    {
        let storageId:string = data.storageId;

        this._core.storageController.deleteStorage(storageId);
    }

    private actionUpdateStorage(data:any):void
    {
        let updateData:StorageUpdateData = data as StorageUpdateData;

        this._core.storageController.updateStorage(updateData);
    }
    ///////////////////////////
    // Notebook
     
    private actionNewNotebook(data:any):void
    {
        let storageId = data.storageId;
        
        this._core.notebookController.createNewNotebook(storageId);
    }

    private actionDeleteNotebook(data:any):void
    {
        let notebookId = data.notebookId;
        
        this._core.notebookController.deleteNotebook(notebookId);
    }

    private actionUpdateNotebook(data:any)
    {
        let updateData:NotebookUpdateData = data as NotebookUpdateData;
    
        this._core.notebookController.updateNotebook(updateData);
    };

    ///////////////////////////////
    // Editor and Mode selection 

    private actionSetNoteListMode(data:any):void
    {
        this._core.setNoteListMode(data.mode);
    }
    
    private actionSelectNotebook(data:any)
    {
        this._core.selectNotebook(data.notebookId);
    };

    ///////////////////////////////
    // Others

    private actionViewNotebookSource(data:any):void
    {
        this._core.viewNotebookSource(data.notebookId);
    }
    
}