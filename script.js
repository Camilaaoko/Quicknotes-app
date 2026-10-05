// Select DOM Elements using querySelector
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const notesList = document.querySelector('#notes-list');

// App State
let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

// Save to LocalStorage
function saveNotes() {
  localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

// Update Note Count Text
function updateNoteCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render Notes
function render(filterTerm = '') {
  notesList.innerHTML = '';

  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(filterTerm.toLowerCase())
  );

  updateNoteCount(notes.length);

  if (filteredNotes.length === 0 && notes.length > 0) {
    const noMatch = document.createElement('li');
    noMatch.textContent = "No notes match your search.";
    notesList.appendChild(noMatch);
    return;
  }

  filteredNotes.forEach(note => {
    const li = document.createElement('li');
    li.className = `note-card category-${note.category.toLowerCase()}`;

    const contentDiv = document.createElement('div');

    const textPara = document.createElement('p');
    textPara.textContent = note.text; // Safe text insertion preventing XSS

    const metaPara = document.createElement('p');
    metaPara.className = 'note-meta';
    metaPara.textContent = `Category: ${note.category} | Created: ${note.createdAt}`;

    contentDiv.appendChild(textPara);
    contentDiv.appendChild(metaPara);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

// Add Note Handler
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();

  // Validation
  if (text === '') {
    errorMessage.textContent = 'Please type a note first.';
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;
  }

  errorMessage.textContent = ''; // Clear error on success

  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.unshift(newNote);
  saveNotes();
  render();

  noteInput.value = '';
});

// Delete Note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render(searchInput.value);
}

// Search Handler
searchInput.addEventListener('input', (e) => {
  render(e.target.value);
});

// Initial Render on Load
render();