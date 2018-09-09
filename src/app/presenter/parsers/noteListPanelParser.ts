// Core
import Note from "core/data/note";

export default class NoteListPanelParser
{
    public static createListData(notes:Note[]): ViewNoteItemData[]
    {
        let listData:ViewNoteItemData[] = notes.map((note:Note) =>
        {
            return {
                id:note.id, 
                title:note.title, 
                created:note.created,
                updated:note.updated,
            };
        });

        return listData;
    }
}