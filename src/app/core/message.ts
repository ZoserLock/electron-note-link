export default class Message
{

    
    public static readonly updateLeftPanel:string   = "update:LeftPanel";
    public static readonly updateNoteList:string    = "update:NoteList";
    public static readonly updateNoteView:string    = "update:NoteView";

    public static readonly searchUpdated:string     = "action:SearchUpdated";
    public static readonly searchCancelled:string   = "action:SearchCancelled";

    public static readonly createStorage:string     = "action:NewNotebookStorage";
    public static readonly createNotebook:string    = "action:NewNotebook";
    public static readonly createNote:string        = "action:NewNote";
    
    public static readonly removeStorage:string     = "action:RemoveNotebookStorage";
    public static readonly removeNotebook:string    = "action:RemoveNotebook";
    public static readonly removeNote:string        = "action:RemoveNote";


    public static readonly selectNotebook:string    = "action:SelectNotebook";
    public static readonly selectNote:string        = "action:SelectNote";
    public static readonly setNoteListMode:string   = "action:SetNoteListMode";


    public static readonly updateNote:string        = "action:UpdateNote";


    // Cache Related 
    public static readonly cacheUpdate:string       = "action:cache:Update";
    public static readonly cacheGenerate:string     = "action:cache:Generate";

    // Windows Related
    public static readonly windowMinimize:string    = "action:window:Minimize";
    public static readonly windowMaximize:string    = "action:window:Maximize";
    public static readonly windowClose:string       = "action:window:Close";
    public static readonly windowLoaded:string      = "action:window:loaded";
   


    
} 