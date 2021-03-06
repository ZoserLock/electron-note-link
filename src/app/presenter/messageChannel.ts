export default class MessageChannel
{
    // Update Messages
    public static readonly updateNavigationPanel:string   = "update:NavigationPanel";
    public static readonly updateNoteListPanel:string     = "update:NoteListPanel";
    public static readonly updateNoteViewPanel:string     = "update:NoteViewPanel";

    // Search Messages
    public static readonly searchBegin:string       = "action:SearchBegin";
    public static readonly searchUpdated:string     = "action:SearchUpdated";
    public static readonly searchCancelled:string   = "action:SearchCancelled";

    public static readonly createStorage:string     = "action:NewStorage";
    public static readonly createNotebook:string    = "action:NewNotebook";
    public static readonly createNote:string        = "action:NewNote";
    
    public static readonly removeStorage:string     = "action:RemoveStorage";
    public static readonly deleteStorage:string     = "action:DeleteStorage";
    public static readonly deleteNotebook:string    = "action:DeleteNotebook";
    public static readonly deleteNote:string        = "action:DeleteNote";


    public static readonly selectNotebook:string    = "action:SelectNotebook";
    public static readonly selectNote:string        = "action:SelectNote";
    public static readonly setNoteListMode:string   = "action:SetNoteListMode";

    public static readonly updateNote:string        = "action:UpdateNote";
    public static readonly updateStorage:string     = "action:UpdateStorage";

    public static readonly createNoteLink:string    = "action:CreateNoteLink";
    public static readonly duplicateNote:string     = "action:DuplicateNote";
    public static readonly renameNote:string        = "action:RenameNote";
    public static readonly restoreNote:string       = "action:RestoreNote";
    public static readonly moveNote:string          = "action:MoveNote";

    public static readonly renameNotebook:string    = "action:RenameNotebook";
    public static readonly renameStorage:string     = "action:RenameStorage";

    public static readonly viewNotebookSource:string = "action:ViewNotebookSource";
    public static readonly viewNoteSource:string     = "action:ViewNoteSource";

    public static readonly showPrevState:string    = "action:ShowPrevState";
    public static readonly showNextState:string    = "action:ShowNextState";

    // Popup Related
    public static readonly showPopup:string         = "action:popup:ShowPopup";
    public static readonly hidePopup:string         = "action:popup:HidePopup";
    public static readonly popupResult:string       = "action:popup:Result";

    // Loading Panel
    public static readonly showLoading:string       = "action:ShowLoading";
    public static readonly hideLoading:string       = "action:HideLoading";

    // Windows Related
    public static readonly windowMinimize:string    = "action:window:Minimize";
    public static readonly windowMaximize:string    = "action:window:Maximize";
    public static readonly windowClose:string       = "action:window:Close";
    public static readonly windowMenu:string        = "action:window:Menu";
    public static readonly windowLoaded:string      = "action:window:loaded";
   
    //  Focus Related
    public static readonly focusSearchBar:string    = "action:focus:SearchBar";
    public static readonly focusNote:string         = "action:focus:Note";
    public static readonly focusNotebook:string     = "action:focus:Notebook";
    public static readonly focusStorage:string      = "action:focus:Storage";

    // Test Related
    public static readonly testPopup:string         = "test:popup";

    
} 