// Core
import Note from "core/data/note";

export default class NoteViewPanelParser
{
    public static createFullNoteData(note:Note):ViewNoteItemData
    {
        return {
            id:note.id, 
            title:note.title, 
            text:note.text,
            trashed:note.trashed,
            started:note.started,
            created:note.created,
            updated:note.updated,
            notebookName:note.parent.name,
        };
    }
}