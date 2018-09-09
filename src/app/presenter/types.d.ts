declare const enum PendingUpdate 
{
    None              = 0x0,
    NavigationPanel   = 0x1,
    NoteList          = 0x2,
    NoteView          = 0x4,
}


// Interfaces to send data from presenter to views.
declare interface ViewCoreData
{
    readonly selectedNotebook:string;
    readonly selectedNote:string;
    readonly noteListMode:number;
}

declare interface ViewStorageItemData
{
    readonly id:string;
    readonly name:string;
    readonly notebooks:ViewNotebookItemData[];
}

declare interface ViewNotebookItemData
{
    readonly id:string;
    readonly name:string;
}

declare interface ViewNoteItemData
{
    id:string, 
    title:string, 
    text:string,
    trashed:boolean,
    started:boolean,
    created:number,
    updated:number,
    notebookName:string,
}