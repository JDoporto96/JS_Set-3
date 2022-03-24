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
        const btnAddNote = this.root.querySelector(".add_note");
        const btnDeleteNote = this.root.querySelector(".delete_note");
        const inputTitle = this.root.querySelector(".note_title");
        const inputBody = this.root.querySelector(".note_body");

        

        btnAddNote.addEventListener("click", () =>{
            this.onNoteAdd();
        });

        btnDeleteNote.addEventListener("click", () =>{
            const doDelete = confirm("Continue deleting this note?");

            if(doDelete){
                this.onNoteDelete();
            }
        });

        [inputTitle,inputBody].forEach(field =>{
            field.addEventListener("blur", () =>{
                const updatedTitle= inputTitle.value.trim();
                const updatedBody= inputBody.value.trim();

                this.onNoteEdit(updatedTitle,updatedBody);
            })
        })
        


        inputBody.addEventListener('keydown', e => {
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
        const notesListContainer = this.root.querySelector(".note_list");

        notesListContainer.innerHTML=" ";
        
        for(const note of notes){
            const html =this.createListItemHTML(note.id, note.title,note.body, new Date(note.updated),new Date(note.creation));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        notesListContainer.querySelectorAll(".note_item").forEach(notesListItem=>{
            notesListItem.addEventListener("click",() =>{
                this.onNoteSelect(notesListItem.dataset.noteId)

            });

        })

    }

    updateActiveNote(note){
        this.root.querySelector(".note_title").value=note.title;
        this.root.querySelector(".note_body").value=note.body;

        this.root.querySelectorAll(".note_item").forEach(notesListItem =>{
            notesListItem.classList.remove("note_item--selected");
        });
        this.root.querySelector(`.note_item[data-note-id="${note.id}"]`).classList.add("note_item--selected");
    }

    NotePreview(visible){
        this.root.querySelector(".notes_preview").style.visibility=visible? "visible" : "hidden";
    }
}