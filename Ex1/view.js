export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}){
        this.root=root;
        this.onNoteSelect=onNoteSelect;
        this.onNoteAdd=onNoteAdd;
        this.onNoteEdit=onNoteEdit;
        this.onNoteDelete=onNoteDelete;
        this.root.innerHTML=`
            <div class="notes_sidebar">
                <button class="add_note" type="button">Add note</button>
                <div class="note_list"> </div>
                <button class="delete_note" type="button">Delete note</button>
            </div>
            <div class="notes_preview">
                <input class="note_title" type="text" placeholder="New note">
                <textarea class="note_body" placeholder="Enter your text here"></textarea>
                
            </div>
            `;
        this.preview =this.root.querySelector(".notes_preview");
        this.note_title=this.root.querySelector(".note_title");
        this.note_body=this.root.querySelector(".note_body");
        this.notesListContainer = this.root.querySelector(".note_list");

        
        const btnAddNote = this.root.querySelector(".add_note");
        const btnDeleteNote = this.root.querySelector(".delete_note");

        btnAddNote.addEventListener("click", () =>{
            this.onNoteAdd();
        });

        btnDeleteNote.addEventListener("click", () =>{
            const doDelete = confirm("Continue deleting this note?");

            if(doDelete){
                this.onNoteDelete();
            }
        });


        [this.note_title,this.note_body].forEach(field =>{
            field.addEventListener("blur", () =>{
                const updatedTitle= this.note_title.value.trim();
                const updatedBody= this.note_body.value.trim();

                this.onNoteEdit(updatedTitle,updatedBody);
            })
        })
        


        this.note_body.addEventListener('keydown', e => {
            if ( e.key === 'Tab' && !e.shiftKey ) {
                document.execCommand('insertText', false, "\t");
                e.preventDefault();
                return false;
            }
        });

        this.NotePreview(false);

    }

    createListItemHTML(id,title,body,updated,creation){
        const MAX_BODY_LENGTH=60;

        return `
        <div class="note_item" data-note-id="${id}">
            <div class="lnote_title">${title}</div>
            <div class="lnote_body">
            ${body.substring(0,MAX_BODY_LENGTH)}
            ${body.length > MAX_BODY_LENGTH ? "...":""}
            </div>
            <div class="lnote_updated">Created on: ${creation.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})}
            </div>
            <div class="lnote_updated">
            Last edit: ${updated.toLocaleString('en-us', {dateStyle :"full", timeStyle: "short"})}
            </div>
        </div>
        `;
    }

    updateNotesList(notes){
        

        this.notesListContainer.innerHTML=" ";
        
        for(const note of notes){
            const html =this.createListItemHTML(note.id, note.title,note.body, new Date(note.updated),new Date(note.creation));

            this.notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        

        this.notesListContainer.addEventListener("click",(event) =>{
            let ListItem =event.target.closest(".note_item"); 
            if(ListItem){
                this.onNoteSelect(ListItem.dataset.noteId);
            }   
            

            });


    }

    updateActiveNote(note){
        this.note_title.value=note.title;
        this.note_body.value=note.body;

        this.root.querySelectorAll(".note_item").forEach(notesListItem =>{
            notesListItem.classList.remove("note_item--selected");
        });
        this.root.querySelector(`.note_item[data-note-id="${note.id}"]`).classList.add("note_item--selected");
    }

    NotePreview(visible){
        this.preview.style.visibility=visible? "visible" : "hidden";
    }
}