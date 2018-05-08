import {ipcMain, BrowserWindow, dialog} from "electron"; 

import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Message from "../core/message"
import DataManager from "../core/dataManager";
import Editor from "../core/editor";

import NotebookStorage from "../notes/notebookStorage";
import Notebook from "../notes/notebook";
import Note from "../notes/note";

import Controller from "./controller";
import Application from "../core/application";

export default class LeftPanelController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);
        ipcMain.on(Message.updateLeftPanel,()=>this.updateLeftPanel());

        ipcMain.on(Message.createStorage,()=>this.actionCreateNewNotebookStorage());
        ipcMain.on(Message.createNotebook,(event:any,data:any)=>this.actionNewNotebook(data));
        ipcMain.on(Message.selectNotebook,(event:any,data:any)=>this.actionSelectNotebook(data));
    }

    // Updates
    public updateLeftPanel():void
    {
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;
        let selectedNotebook = Editor.instance.selectedNotebook;

        let selectedNotebookId:String = "";
 
        if(selectedNotebook != null)
        {
            selectedNotebookId = selectedNotebook.id;
        }

        this.sendUIMessage(Message.updateLeftPanel,{storages:storages, selectedNotebookId:selectedNotebookId});
    }

    private actionCreateNewNotebookStorage():void
    {
        let targetPath = dialog.showOpenDialog({title:"Create new Storage",properties:["openDirectory"]});

        if(targetPath != null && targetPath.length > 0)
        {
            let storagePath = targetPath[0];

            if(DataManager.instance.isLocationStorage(storagePath))
            {
                if(this.addExistingNotebookStorage(storagePath))
                {

                }
                else
                {
                    Debug.logError("Can't add existing storage from that location");
                    //Show errror
                }
            }
            else
            {
                if(DataManager.instance.canUseStorageLocation(storagePath))
                {
                    this.createNewNotebookStorage(storagePath);
                }
                else
                {
                    Debug.logError("Can't use that location as storage location");
                    //Show errror
                }
            }
        }
    }
    
    private addExistingNotebookStorage(path:string):void
    {

     //   DataManager.instance.addStorage(path);
    }

    private createNewNotebookStorage(path:string):void
    {
        let storage = NotebookStorage.create(uuid(), path);

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        ipcMain.emit(Message.updateNoteList);
    }
    
    private actionNewNotebook(data:any):void
    {
        let storageId = data.storage;

        let storage:NotebookStorage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            let notebook:Notebook = Notebook.create(uuid(), Path.join(storage.folderPath,"/notebooks"));

            if(DataManager.instance.saveNotebook(notebook))
            {
                DataManager.instance.addNotebook(notebook);
                storage.addNotebook(notebook);
                DataManager.instance.saveStorage(storage);
            }

            this.updateLeftPanel();
        }
        else
        {
            Debug.logError("storage does not exist");
        }
    }

 
    private actionSelectNotebook(data:any)
    {
        Editor.instance.selectNotebook(data.notebookId);
    };
    
}