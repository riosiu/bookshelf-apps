const UNCOMPLETED_LIST = 'incompleteBookshelfList';
const COMPLETED_LIST = 'completeBookshelfList';
const ITEMID = 'bookId';


function addBook (){
    const uncompletedListBook = document.getElementById(UNCOMPLETED_LIST);
    const completedListBook = document.getElementById(COMPLETED_LIST);

    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYears = document.getElementById('inputBookYear').value;
    const isDone = document.getElementById('inputBookIsComplete').checked;

    const doneBook = makeBooks(textTitle,textAuthor,textYears,isDone);
    const undoneBook = makeBooks(textTitle,textAuthor,textYears,isDone);

    if (!isDone){
        const objectofBook = composeNewDataofBook(textTitle,textAuthor,textYears,isDone);
        undoneBook[ITEMID] = objectofBook.id;
        book.push(objectofBook);
        uncompletedListBook.append(undoneBook);
    }else{
        const objectofBook = composeNewDataofBook(textTitle,textAuthor,textYears,isDone);
        doneBook[ITEMID] = objectofBook.id;
        book.push(objectofBook);
        completedListBook.append(doneBook);
    }
    updateBookToStorage();
}

function makeBooks(title, author,years,isDone){
    const textTitle = document.createElement('h3');
    textTitle.innerHTML=title;

    const textAuthor = document.createElement('h4');
    textAuthor.innerHTML =`Penulis: <span id="author">` + author + `</span>`;

    const textYears = document.createElement('p');
    textYears.innerHTML=`Released (Years): <span id="years">` + years + `</span>`;
    
    const button = document.createElement('div');
    button.classList.add('action');

    const textContainer = document.createElement('div');
    textContainer.classList.add('item');
    textContainer.append(textTitle,textAuthor,textYears);

    const articleContainer = document.createElement('div');
    articleContainer.classList.add('book_item');
    articleContainer.append(textContainer,button);


    if(isDone){
        button.append(
            undoneButton(),
            removeButton(),
            editbButton()
            );
    }else{
        button.append(
            doneButton(),
            removeButton(),
            editbButton()
            );
    }
    return articleContainer;
}

function createDeleteButton(buttonClass,eventListener){
    const button= document.createElement('button');
    button.classList.add(buttonClass);
    button.innerHTML='Delete';
    button.addEventListener('click',function(event){
        eventListener(event);
        updateBookToStorage();
    });

    return button;
}

function createDoneButton(buttonClass,eventListener){
    const button= document.createElement('button');
    button.classList.add(buttonClass);
    button.innerHTML='Done Read';
    button.addEventListener('click',function(event){
        eventListener(event);
        updateBookToStorage();
    });

    return button;
}

function createUndoneButton(buttonClass,eventListener){
    const button= document.createElement('button');
    button.classList.add(buttonClass);
    button.innerHTML='Undone Read';
    button.addEventListener('click',function(event){
        eventListener(event);
    });

    return button;
}

function createEditButton(buttonClass,eventListener){
    const button = document.createElement('button');
    button.classList.add(buttonClass);
    button.innerHTML = 'Edit Book';
    button.addEventListener('click',function(event){
        eventListener(event);
    });
    return button;
}

function editbButton(){
    return createEditButton('yellow',function(event){
        editBooks(event.target.parentElement.parentElement);
    })
}

function doneButton(){
    return createDoneButton('green' ,function(event){
        addBookToCompletedRead(event.target.parentElement.parentElement);
    });
}

function undoneButton(){
    return createUndoneButton('green' ,function(event){
        undoBook(event.target.parentElement.parentElement);
    });
}

function removeButton(){
    return createDeleteButton('red' , function (event){
        const konfirm = confirm('Item ini akan dihapus? Tekan "OK" ');
        if(konfirm == true){
            removeBook(event.target.parentElement.parentElement);
        }
    });
}


function addBookToCompletedRead(bookElement){
    const completedBooks = document.getElementById(COMPLETED_LIST);

    const title = bookElement.querySelector('.book_item h3').innerText;
    const author = bookElement.querySelector('span#author').innerText;
    const years= bookElement.querySelector('span#years').innerText;

    const newBook = makeBooks (title, author,years,true);
    completedBooks.append(newBook);

    const getBook = findBook(bookElement[ITEMID]);
    getBook.isDone= true;
    newBook[ITEMID] = getBook.id;

    bookElement.remove();
    updateBookToStorage();
}

function undoBook(bookElement){
    const incompletedBooks = document.getElementById(UNCOMPLETED_LIST);

    const title = bookElement.querySelector('.book_item h3').innerText;
    const author = bookElement.querySelector('span#author').innerText;
    const years= bookElement.querySelector('span#years').innerText;

    const newBook = makeBooks (title, author,years,false);
    incompletedBooks.append(newBook);

    const getBook = findBook(bookElement[ITEMID]);
    getBook.isDone= false;
    newBook[ITEMID] = getBook.id;

    bookElement.remove();
    updateBookToStorage();
}

function removeBook(bookElement){
    const bookPosition = findBookIndex(bookElement[ITEMID]);
    book.splice(bookPosition,1);
    bookElement.remove();
    updateBookToStorage();
}

function editBooks(bookElement){
    const bookshelf = findBook(bookElement[ITEMID]);
    const edit = document.getElementById('edit_section');
    document.body.classList.toggle('overflow');

    document.getElementById('edit-id').value = bookElement[ITEMID];
    document.getElementById('inputEditBookTitle').value = bookshelf.title;
    document.getElementById('inputEditBookAuthor').value = bookshelf.author;
    document.getElementById('inputEditBookYear').value = bookshelf.years;

    edit.style.display='block';
}

function saveEdit(){
    const edit = document.getElementById('edit_section');

    const idBook = document.getElementById('edit-id').value;
    const judul = document.getElementById('inputEditBookTitle').value;
    const penulis = document.getElementById('inputEditBookAuthor').value;
    const tahun = document.getElementById('inputEditBookYear').value;

    const bookPosition = findBookIndex(parseInt(idBook));
    book[bookPosition].title = judul;
    book[bookPosition].author = penulis;
    book[bookPosition].years = tahun;

    refreshBooks();
    edit.style.display = 'none';
    document.body.classList.toggle('overflow');
    updateBookToStorage();
}


function searchTheBooks (){
    let input = document.getElementById('searchBookTitle').value;
    input = input.toLowerCase();
    let findtheBook = document.getElementsByClassName('book_item');
    
    for (let i =0;i<findtheBook.length;i++){
        if (!findtheBook[i].innerHTML.toLowerCase().includes(input)){
            event.preventDefault();
            findtheBook[i].style.display='none';
        }else{
            findtheBook[i].style.display = 'book_item';
        }
    }
}


/* storage */

let book =[];

const STORAGE_KEY = 'BOOK-APPS';

function localStorageIsExist() {
    if (typeof (Storage)=== 'undefined'){
        alert('Ur Browser Not Supported Local Storage!!')
        return false;
    }
    return true;
}

function saveBook(){
    const stringifyBook = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY,stringifyBook);
    document.dispatchEvent(new Event('onSaved'));
}

function loadBookFromStorage(){
    const setBook = localStorage.getItem('bookshelf_data');
    
    let bookShelf = JSON.parse(setBook);

    if(bookShelf !== null){
        book = bookShelf;
    }

    document.dispatchEvent(new Event('onLoad'));
}


function updateBookToStorage(){
    if (localStorageIsExist())
        saveBook();
    
}


function composeNewDataofBook(title, author,years,isDone){
    return{id: + new Date(),
        title,
        author,
        years,
        isDone
    };    
}

function findBook (bookId){
    for (books of book){
        if (books.id === bookId)
            return books;
    }

    return null;
}

function findBookIndex(bookId){
    let index = 0;
    for (books of book){
        if(books.id === bookId)
            return index;
        
        index++;
    }
    return -1;
}

function refreshBooks(){
    const incompletedBooks = document.getElementById(UNCOMPLETED_LIST);
    const completedBooks = document.getElementById(COMPLETED_LIST);

    incompletedBooks.innerHTML = '';
    completedBooks.innerHTML = '';
    
    for (books of book){
        const newBook = makeBooks(books.title, books.author,books.years,books.isDone);
        newBook[ITEMID] = books.id;

        if(books.isDone){
            completedBooks.append(newBook);
        }else{
            incompletedBooks.append(newBook);
        }
    }
}

/* Render */

document.addEventListener('DOMContentLoaded',function(){
    const submitBook = document.getElementById('inputBook');
    const searchBooks = document.getElementById('searchBook');
    const editBook = document.getElementById('inputEditBook');

    submitBook.addEventListener('submit',function(event){
        event.preventDefault();
        addBook();
    });

    searchBooks.addEventListener('submit',function(event){
        event.preventDefault();
        searchTheBooks();
    });

    editBook.addEventListener('submit',function(event){
        event.preventDefault();
        saveEdit();
    });

    document.querySelector('#editCancelSubmit').addEventListener('click',function(event){
        event.preventDefault();
        document.querySelector('.edit_section').style.display = 'none';
        document.body.classList.toggle('overflow');
    })

    if (localStorageIsExist()){
        loadBookFromStorage();
    };
});

document.addEventListener('onSaved',function(){
    console.log('data disimpan!!');
});

document.getElementById('onLoad',function(){
    refreshBooks();
});
