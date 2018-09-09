
// Core
import Core     from "core/core";
import Platform from "core/platform";

export default interface Presentation
{
    initialize(core:Core, platform:Platform):void;

    // 
    updatePresentation():void;
    updateNavigationPanel():void;
    updateNoteListPanel():void;
    updateNoteViewPanel():void;

    // Popups
    // showConfirmationPopup():void;
}