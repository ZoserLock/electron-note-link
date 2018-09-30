// Core
import Note from "core/data/note";

export default class NodeDataParser
{
    public static createNoteFullData(note:Note):ViewNoteFullItemData
    {
        return {
            id:note.id, 
            title:note.title, 
            text:note.text,
            trashed:note.trashed,
            started:note.started,
            created:note.created,
            updated:note.updated,
            notebookId:note.parent.id,
            notebookName:note.parent.name,
        };
    }

    public static createNoteListData(notes:Note[]):ViewNoteItemData[]
    {
        let outNotes :ViewNoteItemData[] = notes.map((note:Note)=>
        {
            return {
                id:note.id, 
                title:note.title,
                created:note.created,
                updated:note.updated,
                notebookName:note.parent.name,
            }
        });
        return outNotes;
    }
}