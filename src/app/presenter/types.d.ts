declare const enum PendingUpdate 
{
    None              = 0x0,
    NavigationPanel   = 0x1,
    NoteList          = 0x2,
    NoteView          = 0x4,
}


// Parsers

// CoreStatus Data
declare interface CoreStatusData
{
    readonly selectedNotebook:string;
    readonly selectedNote:string;
    readonly noteListMode:number;
}

// Navigation Panel Item Data
declare interface NavStorageItemData
{
    readonly id:string;
    readonly name:string;
    readonly notebooks:NavNotebookItemData[];
}

declare interface NavNotebookItemData
{
    readonly id:string;
    readonly name:string;
}