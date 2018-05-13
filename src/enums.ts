
export enum CacheAction 
{
    None            = 1,
    UpdateStorage   = 2,
    UpdateNotebook  = 3,
    UpdateNote      = 4,
}

export enum NoteListMode 
{
    Notebook = 1,
    Search,
    Trash,
    Started,
    All,
}

export enum EditorPendingUpdate 
{
    None     = 0x0,
    LeftPanel = 0x1,
    NoteList = 0x2,
    NoteView = 0x4,
}