export default class MessageChannel
{

    public static readonly updateLeftPanel:string   = "update:LeftPanel";
    public static readonly updateNoteList:string    = "update:NoteList";
    public static readonly updateNoteView:string    = "update:NoteView";

    public static readonly beginQuickSearch:string  = "action:BeginQuickSearch";
    public static readonly searchUpdated:string     = "action:SearchUpdated";
    public static readonly searchCancelled:string   = "action:SearchCancelled";

    public static readonly createStorage:string     = "action:NewNotebookStorage";
    public static readonly createNotebook:string    = "action:NewNotebook";
    public static readonly createNote:string        = "action:NewNote";
    
    public static readonly removeStorage:string     = "action:RemoveNotebookStorage";
    public static readonly deleteStorage:string     = "action:deleteNotebookStorage";
    public static readonly removeNotebook:string    = "action:RemoveNotebook";
    public static readonly removeNote:string        = "action:RemoveNote";


    public static readonly selectNotebook:string    = "action:SelectNotebook";
    public static readonly selectNote:string        = "action:SelectNote";
    public static readonly setNoteListMode:string   = "action:SetNoteListMode";


    public static readonly updateNote:string        = "action:UpdateNote";


    // Popup Related
    public static readonly showPopup:string       = "action:popup:ShowPopup";
    public static readonly hidePopup:string       = "action:popup:HidePopup";
    public static readonly popupResult:string     = "action:popup:Result";

    // Windows Related
    public static readonly windowMinimize:string    = "action:window:Minimize";
    public static readonly windowMaximize:string    = "action:window:Maximize";
    public static readonly windowClose:string       = "action:window:Close";
    public static readonly windowLoaded:string      = "action:window:loaded";
   


    
} 