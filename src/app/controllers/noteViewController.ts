import {ipcMain, BrowserWindow} from "electron"; 

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
import PopupManager from "../core/popupManager";

export default class NoteViewController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);

        ipcMain.on(Message.updateNoteView ,()=>this.updateNoteView());

        ipcMain.on(Message.updateNote,(event:any,data:any) =>{this.updateNote(data);});
        ipcMain.on("action:TestPopup",(event:any,data:any) =>{this.testPopup();});

    }

    public testPopup():void
    {
        PopupManager.instance.showConfirmationPanel("titulon","Texto que manda","OKA","EXIT",()=>{Debug.log("ON OK!");},()=>{Debug.log("ON CANCEL");});
    }

    public updateNoteView():void
    {
        Debug.log("updateNoteView()");

        let selectedNote = Editor.instance.selectedNote;

        if(selectedNote != null)
        {
            this.sendUIMessage(Message.updateNoteView,{note:selectedNote.GetDataObject()});
        }
    }

    public updateNote(data:any):void
    {
        if(!data["id"])
        {
            return;
        }

        let note:Note = DataManager.instance.getNote(data.id);

        if(note != null)
        {
            if(data["text"])
            {
                note.text = data.text;
            }

            if(data["title"])
            {
                note.title = data.title;
            }

            DataManager.instance.saveNote(note);

            Editor.instance.updateNoteList();

            if(note == Editor.instance.selectedNote)
            {
                Editor.instance.updateNoteView();
            }
        }
    }
}