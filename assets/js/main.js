const SAVED_BOOK = "saved_book"
const RENDER_EVENT = "render_event"
const STORAGE_KEY = "books_key"
const books = []
const popupAdd = document.querySelector("[data-add-popup]")

// preload animation
window.addEventListener("load" , () => {
	const preload = document.querySelector(".preload")
	preload.classList.add("hide")
	// hapus elemen setelah 1 detik disembunyikan
	setTimeout(()=> {
		preload.style.display = "none"
	},1000)
})

document.addEventListener(SAVED_BOOK, (e) => {
	const detail = e.detail

	if (detail === "hapus"){
		displayNotification(2000,`Data buku berhasil di${detail}!`)
	}else if (detail === "tambah"){
		displayNotification(2000,`Data buku berhasil di${detail}!`)
	}else if (detail === "ubah"){
		displayNotification(2000,`Data buku berhasil di${detail}!`)
	}else if (detail === "baca"){
		displayNotification(2000,`Buku selesai di${detail}!`)
	}else if (detail === "kembalikan"){
		displayNotification(2000,`Buku telah selesai di${detail} ke rak belum dibaca!`)
	}else{
		displayNotification(2000,"Data buku berhasil dimodifikasi!")
	}
})


function loadAllBooks(){
	 const booksData = localStorage.getItem(STORAGE_KEY);
	 let data = JSON.parse(booksData);
	 
	 if (data !== null) {
	   for (const book of data) {
	     books.push(book);
	   }
	 }
	 
	 document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
	if (isStorageExist()) {
		loadAllBooks()


		const searchBox = document.querySelector(".search-box form")
		searchBox.addEventListener("submit", (e) => {
			e.preventDefault()

			const keyword = document.querySelector("#keyword").value.toLowerCase()
			let result = searchBook(keyword)
			if (result.length > 0){
				searchBox.reset()
				displayNotification(3500, `Klik pada judul "Rak buku" untuk memuat semua data kembali`)
			}
			
		})



	}

	// popup toggler
	const popupTrigger = document.querySelector("[data-trigger-popup]")

	popupTrigger.addEventListener("click", () => {
		popupAdd.classList.toggle("show")
	})


})

function displayNotification(duration = 2000,text = 'Halo'){
	const notification = document.querySelector(".notification")
	notification.innerText = text
	notification.classList.add('show')

	setTimeout(() => {
		notification.classList.remove('show')
	},duration)
}


// navbar menu toggler
const menuToggler = document.querySelector(".menu-toggler")

menuToggler.addEventListener("click", () => {
	const navItems = document.querySelector(".navbar-items")
	navItems.classList.toggle("show")
})



// cek local storage 
function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browsermu tidak mendukung local storage')
    return false
  }
  return true
}


function generateId() {
  return +new Date();
}

// tambah data buku

const addBookForm = document.querySelector("#addBook")

addBookForm.addEventListener("submit", (e) => {
	e.preventDefault()
	addNewBook()
	// tutup popup form
	popupAdd.classList.remove('show')

})

function addNewBook(){
	const title = document.querySelector("input#bookTitle").value
	const author = document.querySelector("input#bookAuthor").value
	const year = document.querySelector("input#bookYear").value
	const isComplete = document.querySelector("input#bookComplete").checked

	const data = createBookObject(generateId(), title.toLowerCase(),author,year,isComplete)
	// jika data berhasil diisi
	// masukkan data ke array books
	books.push(data)
	// kosongkan semua value input
	addBookForm.reset()
	document.dispatchEvent(new Event(RENDER_EVENT))
	document.dispatchEvent(new CustomEvent(SAVED_BOOK, {detail:"tambah"}))
	// simpan data ke local storage
	saveData()
}



function editBookData(id){

	let data = findBook(id)

	if (data == null){
		window.alert("Terjadi kesalahan ketika pengambilan data!Website akan di reload")
		setTimeout(() => {
			location.reload()
		},2500)
	}

	// tamplikan popup untuk update data
	const editPopup = document.querySelector('[data-update-popup]')
	editPopup.classList.add("show")

	// tampilkan data yg tersedia ke elemen input
	let title = document.querySelector("input#bookTitleUpdate")
	let author = document.querySelector("input#bookAuthorUpdate")
	let year = document.querySelector("input#bookYearUpdate")
	let isComplete = data.isComplete


	title.value = data.title
	author.value = data.author
	year.value = data.year


	const updateBookForm = document.querySelector("form#updateBook")
	// jika form disubmit
	updateBookForm.addEventListener("submit", () => {

		// cek jika value kosong
		if (title.value == '' || author.value == '' || year.value == '' ){
			return
		}

		// hapus objek lama lalu ubah ke yang baru
		books.forEach(book => {
   			if (book.id == id){
        		const updatedBook = updateBook(book ,id, title.value, author.value, year.value, isComplete)
        	}
        })

		document.dispatchEvent(new Event(RENDER_EVENT))
		document.dispatchEvent(new CustomEvent(SAVED_BOOK, {detail:"ubah"}))
		// simpan data ke local storage
		saveData()

	})
	
}

function updateBook(bookObject, id,title, author, year, isComplete){
	for (const item in bookObject){
		bookObject.id = id
		bookObject.title = title
		bookObject.author = author
		bookObject.year = year
		bookObject.isComplete = isComplete
	}

	return bookObject
}


function createBookObject(id, title, author, year, isComplete){
	return {
		id,
		title,
		author,
		year,
		isComplete
	}

}


document.addEventListener(RENDER_EVENT, (e) => {
	const searchedBook = e.detail

	const readShelf = document.querySelector("#read")
	readShelf.innerHTML = ""

	const unreadShelf = document.querySelector("#unread")
	unreadShelf.innerHTML = ""

	if (searchedBook == undefined || searchedBook == null){
		books.forEach(book =>{
			const bookElement = createBookListElement(book)

			if (!book.isComplete){
				unreadShelf.append(bookElement)
			}else{
				readShelf.append(bookElement)
			}
		})

	}else{

		searchedBook.forEach(book =>{
			// console.log(book)
			const bookElement = createBookListElement(book)

			if (!book.isComplete){
				// console.log(bookElement)
				unreadShelf.append(bookElement)
			}else{
				// console.log(bookElement)
				readShelf.append(bookElement)
			}
		})
	}

	

})


function searchBook(keyword){
	let data = []
	books.forEach(book => {
		if (book.title === keyword){
			data.push(book)
			document.dispatchEvent(new CustomEvent(RENDER_EVENT, {detail: data}))
		}
	})

	if (data.length <= 0) {
		displayNotification(3000, "Data tidak ditemukan!, Tulis judul lebih spesifik lagi!")
	}
	return data
}

function createBookListElement(booksObject){
	// buat container induk
	const bookWrapper = document.createElement('li');
	bookWrapper.classList.add("book-item")

	// buat container text
	const textWrapper = document.createElement('div')
	textWrapper.classList.add("text-wrapper")

	// buat setiap elemen text lalu masukkan ke dalam container text
	const bookTitle = document.createElement('span')
	bookTitle.innerText = booksObject.title
	bookTitle.classList.add("title")
	textWrapper.append(bookTitle)

	const bookAuthor = document.createElement('span')
	bookAuthor.innerText = booksObject.author
	bookAuthor.classList.add("author")
	textWrapper.append(bookAuthor)

	const bookYear = document.createElement('span')
	bookYear.innerText = booksObject.year
	bookYear.classList.add("year")
	textWrapper.append(bookYear)

	bookWrapper.append(textWrapper)
	bookWrapper.setAttribute("data-id",`bl-${booksObject.id}`)

	// button wrapper
	const buttonsWrapper = document.createElement('div')
	buttonsWrapper.classList.add('btns')

	if (booksObject.isComplete){
		// delete btn
		const deleteBtn = document.createElement("button")
		deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`
		deleteBtn.setAttribute("type","button")
		deleteBtn.setAttribute("id","delete")

		deleteBtn.addEventListener("click", () => {
			// Konfirmasi sebelum data dihapus
			if (window.confirm(`Apakah kamu mau menghapus buku "${booksObject.title}" ini?`)){
				deleteBookData(booksObject.id)
			}else{
				return
			}
		})
		// redo btn
		const undoBtn = document.createElement("button")
		undoBtn.innerHTML = `<i class='bx bx-redo'></i>`
		undoBtn.setAttribute("type","button")
		undoBtn.setAttribute("id","redo")

		undoBtn.addEventListener("click", () => {
			undoBookData(booksObject.id)
		})

		// edit btn
		const editBtn = document.createElement("button")
		editBtn.innerHTML = `<i class='bx bx-pencil'></i>`
		editBtn.setAttribute('data-book-id',booksObject.id)
		editBtn.setAttribute("type","button")
		editBtn.setAttribute("id","edit")

		editBtn.addEventListener("click", () => {
			editBookData(booksObject.id)
		})

		buttonsWrapper.append(editBtn, undoBtn,deleteBtn)
		bookWrapper.append(buttonsWrapper)
	}else{
		// done btn
		const readDoneBtn = document.createElement("button")
		readDoneBtn.innerHTML = `<i class='bx bx-check'></i>`
		readDoneBtn.setAttribute("type","button")
		readDoneBtn.setAttribute("id","done")

		readDoneBtn.addEventListener("click", () => {
			readComplete(booksObject.id)
		})
		// delete btn
		const deleteBtn = document.createElement("button")
		deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`
		deleteBtn.setAttribute("type","button")
		deleteBtn.setAttribute("id","delete")

		deleteBtn.addEventListener("click", () => {
			// Konfirmasi sebelum data dihapus
			if (window.confirm(`Apakah kamu mau menghapus buku "${booksObject.title}" ini?`)){
				deleteBookData(booksObject.id)
			}else{
				return
			}
		})

		// edit btn
		const editBtn = document.createElement("button")
		editBtn.innerHTML = `<i class='bx bx-pencil'></i>`
		editBtn.setAttribute('data-book-id',booksObject.id)
		editBtn.setAttribute("type","button")
		editBtn.setAttribute("id","edit")

		editBtn.addEventListener("click", () => {
			editBookData(booksObject.id)
		})

		buttonsWrapper.append(editBtn, readDoneBtn,deleteBtn)
		bookWrapper.append(buttonsWrapper)
	}
	 
	return bookWrapper
}

// fungsi untuk tombol
function deleteBookData(id){
	const bookTarget = findId(id)

	if (bookTarget === -1) return;
 
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    document.dispatchEvent(new CustomEvent(SAVED_BOOK, {detail:"hapus"}));
    saveData();
} 

function readComplete(id){
  const bookTarget = findBook(id)
 
  if (bookTarget === -null) return;
 
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT))
  document.dispatchEvent(new CustomEvent(SAVED_BOOK, {detail:"baca"}))
  saveData()
}

function undoBookData(id){
  const bookTarget = findBook(id)
 
  if (bookTarget === -null) return;
 
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT))
  document.dispatchEvent(new CustomEvent(SAVED_BOOK, {detail:"kembalikan"}))
  saveData()
}

function findBook(id){
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

function saveData(){
	if(isStorageExist()){
		const parsedData = JSON.stringify(books)
		localStorage.setItem(STORAGE_KEY,parsedData)
	}
}


function findId(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
 
  return -1;
}

