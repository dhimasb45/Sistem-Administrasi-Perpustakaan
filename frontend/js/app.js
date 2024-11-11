document.getElementById("view-books-btn").addEventListener("click", function () {
    fetchBooks();
});

document.getElementById("add-book-btn").addEventListener("click", function () {
    showAddBookForm();
});

function fetchBooks() {
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(data => {
            let content = "<h2>Daftar Buku</h2><ul>";
            data.forEach(book => {
                content += `<li>${book.judul} - ${book.pengarang} <button onclick="deleteBook(${book.id_buku})">Hapus</button></li>`;
            });
            content += "</ul>";
            document.getElementById("main-content").innerHTML = content;
        })
        .catch(error => console.error('Error fetching books:', error));
}

function showAddBookForm() {
    let content = `
        <h2>Tambah Buku</h2>
        <form id="add-book-form">
            <label for="judul">Judul:</label><br>
            <input type="text" id="judul" name="judul"><br><br>
            <label for="pengarang">Pengarang:</label><br>
            <input type="text" id="pengarang" name="pengarang"><br><br>
            <button type="submit">Tambah Buku</button>
        </form>
    `;
    document.getElementById("main-content").innerHTML = content;

    document.getElementById("add-book-form").addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
}

function addBook() {
    const judul = document.getElementById("judul").value;
    const pengarang = document.getElementById("pengarang").value;
    
    fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            judul: judul,
            pengarang: pengarang,
        })
    }).then(response => response.json())
      .then(data => {
          alert("Buku berhasil ditambahkan!");
          fetchBooks(); // Refresh book list
      })
      .catch(error => console.error('Error adding book:', error));
}

function deleteBook(id) {
    fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
    }).then(response => response.json())
      .then(data => {
          alert("Buku berhasil dihapus!");
          fetchBooks(); // Refresh book list
      })
      .catch(error => console.error('Error deleting book:', error));
}