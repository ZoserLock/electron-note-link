// Node.js
import {ipcMain} from "electron"; 
import * as uuid from "uuid/v4";
import * as Path from "path";

// Tools
import Debug from "tools/debug";

// Core
import DataManager  from "core/dataManager";
import Core         from "core/core";
import Note         from "core/data/note";
import PopupManager from "core/popupManager";

// Presenter
import Presenter      from "presenter/presenter";
import MessageChannel from "presenter/messageChannel"

export default class NoteViewPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.updateNoteViewPanel  ,(data:any) => this.update());
        this.registerUIListener(MessageChannel.updateNote           ,(data:any) => this.updateNote(data));

        this.registerUIListener(MessageChannel.testPopup            ,(data:any) => this.testPopup());
    }

    public testPopup():void
    {
        PopupManager.instance.showConfirmationPanel("Test Popup","Testing sub Title Text","Hamaf pig fatber shankle venison beef ribs ","OKA","EXIT",()=>{Debug.log("OK");},()=>{Debug.log("CANCEL");});
    }

    public onUpdateRequested():void
    {
        Debug.log("updateNoteView()");

        let selectedNote = this._core.selectedNote;

        if(selectedNote != null)
        {
            this.sendUIMessage(MessageChannel.updateNoteViewPanel,{note:selectedNote.GetDataObject()});
        }
        else
        {
            this.sendUIMessage(MessageChannel.updateNoteViewPanel,{note:null});
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

            this._core.updateNoteList();

            if(note == this._core.selectedNote)
            {
                this._core.updateNoteView();
            }
        }
    }
}