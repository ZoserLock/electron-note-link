import {ipcMain, BrowserWindow} from "electron"; 

import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Message from "../core/message"
import DataManager from "../core/dataManager";
import Director from "../core/director";

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

        ipcMain.on(Message.createStorage,()=>this.actionNewNotebookStorage());
        ipcMain.on(Message.createNotebook,(event:any,data:any)=>this.actionNewNotebook(data));
        ipcMain.on(Message.selectNotebook,(event:any,data:any)=>this.selectNotebook(data));
    }

    public updateLeftPanel():void
    {
        let storages:Array<NotebookStorage> = DataManager.instance.noteStorages;
        let selectedNotebook = Director.instance.selectedNotebook;

        let selectedNotebookId:String = "";
 
        if(selectedNotebook != null)
        {
            selectedNotebookId = selectedNotebook.id;
        }

        this.sendUIMessage(Message.updateLeftPanel,{storages:storages, selectedNotebookId:selectedNotebookId});
    }

    private actionNewNotebookStorage():void
    {
        let storage = NotebookStorage.create(uuid(),"E:/Tests/NoteLinkData");

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        this.updateLeftPanel();
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

    private updateNoteList()
    {
        ipcMain.emit(Message.updateNoteList);
    }

    private selectNotebook(data:any)
    {
        Director.instance.selectNotebook(data.notebookId);
    };
    
}