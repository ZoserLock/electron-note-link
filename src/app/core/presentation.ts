import Platform from "core/platform";
import Core from "core/core";

export default interface Presentation
{
    initialize(core:Core, platform:Platform):void;

    // 
    updateNavigationPanel():void;
    updateNoteListPanel():void;
    updateNoteViewPanel():void;

    // Popups
    // showConfirmationPopup():void;
}