// Tools
import Debug from "tools/debug";

// Core
import Note         from "core/data/note";

// Presenter
import Presenter            from "presenter/presenter";
import MessageChannel       from "presenter/messageChannel"
import NoteViewPanelParser  from "presenter/parsers/noteViewPanelParser";

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
        this._core.popupController.showConfirmationPanel("Test Popup","Testing sub Title Text","Hamaf pig fatber shankle venison beef ribs ","OKA","EXIT",()=>{Debug.log("OK");},()=>{Debug.log("CANCEL");});
    }

    public onUpdateRequested():void
    {
        let selectedNote = this._core.selectedNote;

        let noteData = null;

        if(selectedNote != null)
        {
            let noteData = NoteViewPanelParser.createFullNoteData(selectedNote);
        }
        
        this.sendUIMessage(MessageChannel.updateNoteViewPanel,{note:noteData});
    }

    public actionUpdateNote(data:any):void
    {
        let updateData:NoteUpdateData = data as NoteUpdateData;

        this._core.noteController.updateNote(updateData)
    }
}