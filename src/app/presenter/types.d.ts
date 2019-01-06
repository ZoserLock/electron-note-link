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
    readonly searchPhrase:string;
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

declare interface ViewNoteFullItemData
{
    readonly id:string, 
    readonly title:string, 
    readonly text:string,
    readonly trashed:boolean,
    readonly started:boolean,
    readonly created:number,
    readonly updated:number,
    readonly notebookId:string,
    readonly notebookName:string,
    readonly storagePath:string
}

declare interface ViewNoteItemData
{
    readonly id:string, 
    readonly title:string, 
    readonly created:number,
    readonly updated:number,
    readonly notebookName:string,
}