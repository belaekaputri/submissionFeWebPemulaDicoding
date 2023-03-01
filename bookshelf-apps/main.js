document.addEventListener('DOMContentLoaded', function () {
    const books = [];
    const RENDER_EVENT = 'render-book';
    const submitBook = document.getElementById('inputBook');


    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    function addBook() {
        const txtTitle = document.getElementById('inputBookTitle').value;
        const txtAuthor = document.getElementById('inputBookAuthor').value;
        const txtYear = document.getElementById('inputBookYear').value;
        const txtIsCompleted = document.getElementById('inputBookIsComplete').checked;
        const generatedID = generateId();
        const bookObjek = generateBookObject(generatedID, txtTitle, txtAuthor, txtYear, txtIsCompleted);
        books.push(bookObjek);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
       
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, title, author, year,isComplete) {
        return {
            id,
            title, 
            author,
            year, 
            isComplete
        }
    }

    document.addEventListener(RENDER_EVENT,function(){
        console.log(books);
    });




function makeBook(bookObjek){
    const ti=document.createElement('h3');
    ti.innerText=bookObjek.title;

    const au=document.createElement('p');
    au.innerText=`Penulis: ${bookObjek.author}`;
    
    const yr=document.createElement('p');
    yr.innerText=`Tahun: ${bookObjek.year}`;
     
    const textArticle=document.createElement('article');
    textArticle.classList.add('book_item');
    textArticle.append(ti,au,yr);
    textArticle.setAttribute('id',`book-${bookObjek.id}`);

    const act=document.createElement('div');
    act.classList.add('action');
    const  trashButton=document.createElement('button');
    trashButton.innerText= 'Hapus Buku';

    if (bookObjek.isComplete){
        const btnFinish=document.createElement('button');
        btnFinish.innerText="Belum Selesai Dibaca";
        btnFinish.classList.add('green');
        
       

        btnFinish.addEventListener('click',function(){
            undoBookFromCompleted(bookObjek.id);
        })
        
        act.append(btnFinish,trashButton);
        trashButton.addEventListener('click',function(){
            removeBook(bookObjek.id);
        })
        textArticle.append(act);
    }else{
        const buttonBefore=document.createElement('button');
        buttonBefore.classList.add('green');
        buttonBefore.innerText='Selesai Dibaca';
        act.append(buttonBefore);
        buttonBefore.addEventListener('click',function(){
            
            addBookToCompleted(bookObjek.id);
        });
        
        trashButton.addEventListener('click',function(){
            removeBook(bookObjek.id);
        });
        act.append(buttonBefore,trashButton);
        textArticle.append(act);
    } 
        return textArticle;
}




document.addEventListener(RENDER_EVENT,function(){
    const incompletedBOOKList=document.getElementById('incompleteBookshelfList'); 
    incompletedBOOKList.innerHTML='';
    
    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
   

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) { 
            completedBOOKList.append(bookElement); 
        }else{
            incompletedBOOKList.append(bookElement);
           
        }
      }
});



function addBookToCompleted(bookId){
    const bookTarget=findBook(bookId);
    if(bookTarget===null) return;
    bookTarget.isComplete=true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

 function removeBook(bookId){
    const bookTarget = findBookIndex(bookId);
    
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }


 function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }


  function findBookIndex(booksId) {
    for (const index in books) {
      if (books[index].id === booksId) {
        return index;
      }
    }
   
    return -1;
  }

/*local storage*/
const SAVED_EVENT= 'saved-book';
const STORAGE_KEY= 'BOOK_APPS';

function isStorageExist(){
    if(typeof(Storage)===undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(){
    if(isStorageExist()){
        const paserd= JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY,paserd);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
document.addEventListener(SAVED_EVENT,function(){
    console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage(){
    const serializedData=localStorage.getItem(STORAGE_KEY);
    let data=JSON.parse(serializedData);
    if (data !==null ){
        for (const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
if(isStorageExist()){
    loadDataFromStorage();
}



const searchBookTitle=document.getElementById("searchBookTitle");
searchBookTitle.addEventListener("input",()=>{
    const filter=searchBookTitle.value.toLowerCase();
    const itemBook=document.querySelectorAll(".book_item");
    itemBook.forEach((item) => {
        let data = item.textContent;
        if (data.toLowerCase().includes(filter.toLowerCase())) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
})


});