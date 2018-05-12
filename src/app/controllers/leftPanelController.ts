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

        ipcMain.on(Message.createStorage,()=>this.actionCreateNewStorage());

        ipcMain.on(Message.removeStorage ,(event:any,data:any)=>this.actionRemoveStorage(data));
        ipcMain.on(Message.removeNotebook ,(event:any,data:any)=>this.actionRemoveNotebook(data));

        ipcMain.on(Message.createNotebook,(event:any,data:any)=>this.actionNewNotebook(data));
        ipcMain.on(Message.selectNotebook,(event:any,data:any)=>this.actionSelectNotebook(data));
    }

    // Updates
    public updateLeftPanel():void
    {
        let storages:any[] = [];

        for(let storage of DataManager.instance.noteStorages)
        {
            storages.push(storage.GetDataObject());
        }
        
        let selectedNotebook = Editor.instance.selectedNotebook;

        let selectedNotebookId:String = "";
 
        if(selectedNotebook != null)
        {
            selectedNotebookId = selectedNotebook.id;
        }

        this.sendUIMessage(Message.updateLeftPanel,{storages:storages, selectedNotebookId:selectedNotebookId});
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
        let storage = NotebookStorage.create(uuid(), path);

        DataManager.instance.addStorage(storage);
        DataManager.instance.saveStorage(storage);

        this.updateLeftPanel();
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
                this.updateLeftPanel();
                return true;
            }
        }

        return false;
    }

    private actionRemoveStorage(data:any):void
    {
        let storageId = data.storage;

        let storage:NotebookStorage = DataManager.instance.getStorage(storageId);

        if(storage != null)
        {
            DataManager.instance.removeStorage(storage);

            this.updateLeftPanel();
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

    private actionRemoveNotebook(data:any):void
    {
        let notebookId = data.notebookId;

        let notebook:Notebook = DataManager.instance.getNotebook(notebookId);

        if(notebook != null)
        {
            let isSelectedNotebook = (Editor.instance.selectedNotebook == notebook);
            let hasSelectedNote = (Editor.instance.selectedNote.parent == notebook);
            
            DataManager.instance.deleteNotebook(notebook);

            this.updateLeftPanel();
  
            if(isSelectedNotebook)
            {
                if(DataManager.instance.notebooks.length > 0)
                {
                    let next:Notebook = DataManager.instance.notebooks[0];
                    Editor.instance.selectNotebook(next.id);
                }
                else
                {
                    Editor.instance.unselectNotebook();
                }
            }


        }
        else
        {
            Debug.logError("actionRemoveStorage: Storage does not exist.");
        }
    }
 
    private actionSelectNotebook(data:any)
    {
        Editor.instance.selectNotebook(data.notebookId);
    };
    
    private actionChangeNotebookName(data:any)
    {
        let notebookId = data.notebookId;
        let newName    = data.name;

        let notebook:Notebook = DataManager.instance.getNotebook(notebookId);

        if(notebook != null)
        {
            DataManager.instance.saveNotebook(notebook);
            this.updateLeftPanel();
        }
        else
        {
            Debug.logError("actionChangeNotebookName: Notebook does not exist.");
        }
    };
}