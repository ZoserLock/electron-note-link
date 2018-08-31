
export enum CacheAction 
{
    None            = 0,
    AddStorage,
    UpdateStorage,
    RemoveStorage,
    UpdateNotebook,  
    RemoveNotebook, 
    UpdateNote,     
    RemoveNote,      
}

export enum NoteListMode 
{
    Notebook = 1,
    Search,
    Trash,
    Started,
    All,
    Disabled,
}

export enum EditorPendingUpdate 
{
    None        = 0x0,
    LeftPanel   = 0x1,
    NoteList    = 0x2,
    NoteView    = 0x4,
}