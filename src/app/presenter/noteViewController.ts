import {ipcMain, BrowserWindow} from "electron"; 

import * as uuid from "uuid/v4";
import * as Path from "path";

import Debug from "../tools/debug";
import Message from "../core/message"
import DataManager from "../core/dataManager";
import Editor from "../core/editor";

import Note from "../core/data/note";

import Presenter from "./presenter";
import PopupManager from "../core/popupManager";

export default class NoteViewController extends Presenter
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
        PopupManager.instance.showConfirmationPanel("Test Popup","Testing sub Title Text","Hamaf pig fatber shankle venison beef ribs ","OKA","EXIT",()=>{Debug.log("OK");},()=>{Debug.log("CANCEL");});
    }

    public updateNoteView():void
    {
        Debug.log("updateNoteView()");

        let selectedNote = Editor.instance.selectedNote;

        if(selectedNote != null)
        {
            this.sendUIMessage(Message.updateNoteView,{note:selectedNote.GetDataObject()});
        }
        else
        {
            this.sendUIMessage(Message.updateNoteView,{note:null});
        }
    }

    public updateNote(data:any):void
    {
        if(!data.hasOwnProperty("id"))
        {
            return;
        }

        let note:Note = DataManager.instance.getNote(data.id);

        if(note != null)
        {
            if(data.hasOwnProperty("text"))
            {
                note.text = data.text;
            }

            if(data.hasOwnProperty("title"))
            {
                note.title = data.title;
            }

            if(data.hasOwnProperty("started"))
            {
                note.started = data.started;
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