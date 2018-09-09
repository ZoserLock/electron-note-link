// Node
import * as uuid from "uuid/v4";
import * as Path from "path";
import * as Fuse from "fuse.js";

// Core
import MessageChannel from "presenter/messageChannel"

// Notes
import Note from "core/data/note";

// Presenter
import Presenter from "presenter/presenter";
import NoteViewPanelParser from "presenter/parsers/noteViewPanelParser";

export default class NoteListPresenter extends Presenter
{
    protected onRegisterListeners():void
    {
        this.registerUIListener(MessageChannel.updateNoteListPanel , (data:any) => this.update());
        
        this.registerUIListener(MessageChannel.createNote          , (data:any) => this.actionNewNote());
        this.registerUIListener(MessageChannel.selectNote          , (data:any) => this.actionSelectNote(data));
        this.registerUIListener(MessageChannel.removeNote          , (data:any) => this.actionRemoveNote(data));

        this.registerUIListener(MessageChannel.searchUpdated       , (data:any) => this.actionSearchUpdated(data));
        this.registerUIListener(MessageChannel.beginQuickSearch    , (data:any) => this.beginQuickSearch(data));
    }

    public onUpdateRequested():void
    {
        let mode:number = this._core.noteListMode;

        let selectedNote:string = "";

        if(this._core.selectedNote != null)
        {
            selectedNote = this._core.selectedNote.id;
        }
      
        let notes:Note[] = [];

        let searchData:string="";

        let title:string = "";

        // HERE WE CAN IMPLEMENT A GENERIC FILTER.
        // Like current filter.filter(notes)
        let noteData:any[] = [];

        if(mode == NoteListMode.Search)
        {
            var options = 
            {
                keys: ['title'],
                threshold: 0.4,
                minMatchCharLength: 3,
            }

            // Process special keyworlds and cache them until the special keywords disapear.
         
            // Cache this list as something like current Searchable notes.
            notes = this._core.dataManager.notes.filter((note:Note)=>
            {
                return (!note.trashed);
            });

            noteData = notes.map((note:Note)=>
            {
                return NoteViewPanelParser.createFullNoteData(note);
            });

            var fuse = new Fuse(noteData, options);

            noteData = fuse.search(this._core.searchPhrase);
            title = "Search results for: "+this._core.searchPhrase;

            // Avoid send if the data have not changed.
        }
        else if(mode == NoteListMode.All)
        {
            notes = this._core.dataManager.notes.filter((note:Note)=>
            {
                return (!note.trashed);
            });
            noteData = notes.map((note:Note)=>
            {
                return NoteViewPanelParser.createFullNoteData(note);
            });
            title = "All Notes"
        }
        else if(mode == NoteListMode.Trash)
        {
            notes = this._core.dataManager.notes.filter((note:Note)=>
            {
                return note.trashed;
            });
            noteData = notes.map((note:Note)=>
            {
                return NoteViewPanelParser.createFullNoteData(note);
            });
            title = "Trash";
        }
        else if(mode == NoteListMode.Notebook)
        {
            if(this._core.selectedNotebook == null || this._core.dataManager.notes.length == 0)
            {
                let data =
                {
                    mode:NoteListMode.Disabled,
                }
        
                this._platform.sendUIMessage(MessageChannel.updateNoteListPanel, data);
                return;
            }

            notes = this._core.selectedNotebook.notes.filter((note:Note)=>
            {
                return (!note.trashed);
            });
            noteData = notes.map((note:Note)=>
            {
                return NoteViewPanelParser.createFullNoteData(note);
            });
            title = this._core.selectedNotebook.name;
        }
        else if(mode == NoteListMode.Started)
        {
            notes = this._core.dataManager.notes.filter((note:Note)=>
            {
                return note.started;
            });
            noteData = notes.map((note:Note)=>
            {
                return NoteViewPanelParser.createFullNoteData(note);
            });
            title = "Started Notes";
        }
        

        // Send filtered data

        let forceUpdate:boolean = true;

        let data =
        {
            title:title,
            notes:noteData,
            mode:mode,
            selectedNote:selectedNote,
            search:searchData,
            forceUpdate:(forceUpdate)?Math.random():0
        }

        this._platform.sendUIMessage(MessageChannel.updateNoteListPanel, data);
    }

    private beginQuickSearch(data:any):void
    {
        this._platform.sendUIMessage(MessageChannel.beginQuickSearch);
    }

    private actionSearchUpdated(data:any):void
    {
        let mode:number = this._core.noteListMode;

        if(mode == NoteListMode.Search)
        {
            if(data == "")
            {
                this._core.cancelSearch(data);
            }
            else
            {
                this._core.updateSearch(data);
            }
        }
        else
        {
            if(data != "")
            {
                this._core.beginSearch(data);
            }
        }
    }

    private actionNewNote():void
    {
        let selectedNotebook = this._core.selectedNotebook;

        if(selectedNotebook != null)
        {
            let note:Note = Note.create(uuid(), Path.join(selectedNotebook.folderPath,selectedNotebook.id));
            
            if(this._core.dataManager.addNote(note))
            {
                this._core.dataManager.saveNote(note);
                selectedNotebook.addNote(note);
                this._core.selectNote(note.id);
                this.update();
            }
        }
    }

    private actionRemoveNote(data:any):void
    {
        let note:Note = this._core.dataManager.getNote(data.noteId);

        if(note != null)
        {
            if(this._core.selectedNote == note)
            {
                this._core.unselectNotebook();
            }

            if(note.trashed)
            {
                this._core.dataManager.deleteNote(note);
            }
            else
            {
                note.setTrashed(true);
                this._core.dataManager.saveNote(note);
            }
            
            this._core.updateNoteList();
            this._core.updateNoteView();
        }
    }

    private actionSelectNote(data:any):void
    {
        this._core.selectNote(data.noteId);
    }
}