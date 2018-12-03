
// Core
import Core     from "core/core";
import Platform from "core/platform";

export default interface Presentation
{
    initialize(core:Core, platform:Platform):void;

    // Presentation update 
    updatePresentation():void;
    updateNavigationPanel():void;
    updateNoteListPanel():void;
    updateNoteViewPanel():void;

    onceNextFrame(func:()=>void):void;

    // Select Note
    scrollToNote(noteId:string):void;
    scrollToNotebook(notebookId:string):void;
    scrollToStorage(storageId:string):void;
}