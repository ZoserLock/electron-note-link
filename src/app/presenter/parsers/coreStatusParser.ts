

// Core
import Core from "core/core";

export default class CoreStatusParser
{
    public static createCoreStatus(core:Core):CoreStatusData
    {
        return {
            selectedNote:(core.selectedNote != null)?core.selectedNote.id:"",
            selectedNotebook:(core.selectedNotebook != null)?core.selectedNotebook.id:"",
            noteListMode:core.noteListMode
        }
    }
}