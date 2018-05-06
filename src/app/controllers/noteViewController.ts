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

export default class NoteViewController extends Controller
{
    constructor(window:Electron.BrowserWindow)
    {
        super(window);

        ipcMain.on(Message.updateNoteView ,()=>this.updateNoteView());

        ipcMain.on(Message.updateNote,(event:any,data:any) =>
        {
            this.updateNote(data.id,data.text);
        });

    }

    public updateNoteView():void
    {
        let selectedNote = Director.instance.selectedNote;

        this.sendUIMessage(Message.updateNoteView,{note:selectedNote});
    }

    public updateNote(id:string, text:string):void
    {
        let selectedNote = Director.instance.selectedNote;

        let note:Note = DataManager.instance.getNote(id);

        if(note != null)
        {
            note.text = text;
            DataManager.instance.saveNote(note);

            if(note == selectedNote)
            {
                this.sendMainMessage(Message.updateNoteView);
            }
        }
    }
}