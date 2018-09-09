// Presenter
import Presenter             from "presenter/presenter";
import MessageChannel        from "presenter/messageChannel"

import NavigationPanelParser from "../parsers/navigationPanelParser";
import CoreStatusParser      from "presenter/parsers/coreStatusParser";

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
            storages: NavigationPanelParser.createListData(storages),
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
    
    ///////////////////////////
    // Notebook
     
    private actionNewNotebook(data:any):void
    {
        let storageId = data.storageId;
        
        this._core.notebookController.createNewNotebook(storageId);
    }

    private actionRemoveNotebook(data:any):void
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
    
}