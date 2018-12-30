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
        this.registerUIListener(MessageChannel.renameStorage      ,(data:any) => this.actionRenameStorage(data));

        this.registerUIListener(MessageChannel.deleteNotebook     ,(data:any) => this.actionDeleteNotebook(data));
        this.registerUIListener(MessageChannel.createNotebook     ,(data:any) => this.actionNewNotebook(data));
        this.registerUIListener(MessageChannel.selectNotebook     ,(data:any) => this.actionSelectNotebook(data));
        this.registerUIListener(MessageChannel.renameNotebook     ,(data:any) => this.actionRenameNotebook(data));

        this.registerUIListener(MessageChannel.moveNote           ,(data:any) => this.actionMoveNote(data));

        this.registerUIListener(MessageChannel.setNoteListMode    ,(data:any) => this.actionSetNoteListMode(data));

        this.registerUIListener(MessageChannel.viewNotebookSource ,(data:any) => this.actionViewNotebookSource(data));

        this.registerUIListener(MessageChannel.showNextState      ,(data:any) => this.actionShowNextState());
        this.registerUIListener(MessageChannel.showPrevState      ,(data:any) => this.actionShowPrevState());
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
    
    private actionRenameStorage(data:any)
    {
        let storageId = data.storageId;
        
        this._core.storageController.renameStorage(storageId);
    };

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

    private actionRenameNotebook(data:any)
    {
        let notebookId = data.notebookId;
        
        this._core.notebookController.renameNotebook(notebookId);
    };

    private actionMoveNote(data:any)
    {
        let notebookId = data.notebookId;
        let noteId      = data.noteId;
        
        this._core.moveNoteToNotebook(noteId,notebookId);
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
    
    private actionShowNextState():void
    {
        this._core.showNextHistoryState();
    }

    private actionShowPrevState():void
    {
        this._core.showPrevHistoryState();
    }
}