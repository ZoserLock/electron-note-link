// Tools
import Debug from "tools/debug";

// Core
import Note         from "core/data/note";

// Presenter
import Presenter            from "presenter/presenter";
import MessageChannel       from "presenter/messageChannel"

import NoteDataParser       from "presenter/parsers/noteDataParser";

export default class NoteViewPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.updateNoteViewPanel  ,(data:any) => this.update());
        this.registerUIListener(MessageChannel.updateNote           ,(data:any) => this.actionUpdateNote(data));

        this.registerUIListener(MessageChannel.testPopup            ,(data:any) => this.testPopup());
    }

    public testPopup():void
    {
       // this._core.popupController.showConfirmationPanel("Test Popup","Testing sub Title Text","Hamaf pig fatber shankle venison beef ribs ","OKA","EXIT",()=>{Debug.log("OK");},()=>{Debug.log("CANCEL");});
        this._core.popupController.showInputPanel("Test Popup","Testing sub Title Text","Are you sure your want to delete this notebook?","ON","CANCEL",(data:any)=>{Debug.log("OK: "+data.text);},()=>{Debug.log("CANCEL");});
    }

    public onUpdateRequested():void
    {
        let selectedNote = this._core.selectedNote;

        let noteData = null;

        if(selectedNote != null)
        {
            noteData = NoteDataParser.createNoteFullData(selectedNote);
        }
        
        this.sendUIMessage(MessageChannel.updateNoteViewPanel,{note:noteData});
    }

    public actionUpdateNote(data:any):void
    {
        let updateData:NoteUpdateData = data as NoteUpdateData;

        this._core.noteController.updateNote(updateData)
    }
}