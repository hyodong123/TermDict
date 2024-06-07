document.addEventListener('DOMContentLoaded', () => {
    const termInput = document.getElementById('term');
    const definitionInput = document.getElementById('definition');
    const addBtn = document.getElementById('addBtn');
    const updateBtn = document.getElementById('updateBtn');
    const searchInput = document.getElementById('search');
    const termList = document.getElementById('termList');

    let currentEditId = null;

    const getTerms = () => {
        const keys = Object.keys(localStorage);
        return keys.filter(key => key.startsWith('term_')).map(key => ({
            id: key.replace('term_', ''),
            term: JSON.parse(localStorage.getItem(key)).term,
            definition: JSON.parse(localStorage.getItem(key)).definition
        }));
    };

    const renderTerms = (filter = '') => {
        termList.innerHTML = '';
        const terms = getTerms()
            .filter(term => term.term.includes(filter))
            .sort((a, b) => a.term.localeCompare(b.term));

        terms.forEach(term => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${term.term}: ${term.definition}</span>
                <button onclick="editTerm('${term.id}')">수정</button>
                <button onclick="deleteTerm('${term.id}')">삭제</button>
            `;
            termList.appendChild(li);
        });
    };

    const saveTerms = (id, term, definition) => {
        localStorage.setItem(`term_${id}`, JSON.stringify({ term, definition }));
    };

    const addTerm = () => {
        const term = termInput.value.trim();
        const definition = definitionInput.value.trim();
        const id = Date.now().toString();

        if (term && definition) {
            saveTerms(id, term, definition);
            renderTerms();
            termInput.value = '';
            definitionInput.value = '';
        }
    };

    const updateTerm = () => {
        const term = termInput.value.trim();
        const definition = definitionInput.value.trim();

        if (term && definition && currentEditId !== null) {
            saveTerms(currentEditId, term, definition);
            renderTerms();
            termInput.value = '';
            definitionInput.value = '';
            addBtn.style.display = 'inline';
            updateBtn.style.display = 'none';
            currentEditId = null;
        }
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            if (currentEditId !== null) {
                updateTerm();
            } else {
                addTerm();
            }
        }
    };

    termInput.addEventListener('keypress', handleEnterKey);
    definitionInput.addEventListener('keypress', handleEnterKey);

    addBtn.addEventListener('click', addTerm);
    updateBtn.addEventListener('click', updateTerm);
    searchInput.addEventListener('input', (e) => renderTerms(e.target.value));

    renderTerms();

    window.editTerm = (id) => {
        const term = getTerms().find(term => term.id === id);
        termInput.value = term.term;
        definitionInput.value = term.definition;
        addBtn.style.display = 'none';
        updateBtn.style.display = 'inline';
        currentEditId = id;
    };

    window.deleteTerm = (id) => {
        localStorage.removeItem(`term_${id}`);
        renderTerms();
    };
});
