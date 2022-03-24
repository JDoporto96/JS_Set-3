import NotesView from "./view.js";
import NotesAPI from "./API.js";

export default class App{
    constructor(root){
        this.notes=[];
        this.activeNote=null;
        this.view= new NotesView(root,this.handlers());

        this.refreshNotes();
    }


    refreshNotes(){
        const notes = NotesAPI.getAllNotes();

        this.setNotes(notes);

        if (notes.length > 0){
            this.setActiveNote(notes[0]);
        }
    }

    setNotes(notes){
        this.notes =notes;
        this.view.updateNotesList(notes);
        this.view.NotePreview(notes.length>0);
    }

    setActiveNote(note){
        this.activeNote=note;
        this.view.updateActiveNote(note);

    }

    handlers(){
        return{
            onNoteSelect: noteId=>{
                const selectedNote = this.notes.find(note =>note.id==noteId);
                this.setActiveNote(selectedNote);
            },

            onNoteAdd: ()=>{
                const newNote={
                    title: "",
                    body:""
                };
                
                NotesAPI.saveNote(newNote);
                this.refreshNotes();
            },

            onNoteEdit: (title, body)=>{
               NotesAPI.saveNote({
                   id: this.activeNote.id,
                   creation: this.activeNote.creation,
                   title: title,
                   body: body,
                   updated:  new Date().toISOString()
               });
               this.refreshNotes();
            },

            onNoteDelete: ()=>{
                const noteId= this.activeNote.id;
                NotesAPI.deleteNote(noteId);
                this.refreshNotes();
            }
        };
    }
}