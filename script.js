$(document).ready(function () {
    const API_KEY = 'AIzaSyDrRfySObJpjK4gu_pY4c9L75QkhHUHhQg';
    let currentPage = 1;
    let totalPages = 0;
    let books = [];


    function searchBooks(query, page = 1) {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${(page - 1) * 10}&maxResults=10&key=${API_KEY}`)
        .done(function (data) {
            books = data.items || [];
            totalPages = Math.ceil(data.totalItems / 10);
            displayResults(books);
            displayPagination(totalPages, page);
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("API request failed:", textStatus, error);
            $('#results').html('<p>An error occurred while fetching data. Please try again.</p>');
        });
    }


    function displayResults(books) {
        $('#results').empty();
        if (books.length === 0) {
            $('#results').html('<p>No results found.</p>');
            return;
        }
        books.forEach(book => {
            const title = book.volumeInfo.title;
            const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
            $('#results').append(`
                <div class="book" data-id="${book.id}">
                    <img src="${imageUrl}" alt="${title}">
                    <p>${title}</p>
                </div>
            `);
        });
    }


    function displayPagination(totalPages, currentPage) {
        $('#pagination').empty();
        for (let i = 1; i <= totalPages; i++) {
            $('#pagination').append(`<span class="page-link" data-page="${i}">${i}</span>`);
        }
        $('.page-link').removeClass('active');
        $(`.page-link[data-page="${currentPage}"]`).addClass('active');
    }


    $('#searchButton').click(function () {
        const query = $('#searchTerm').val().trim();
        if (query){
            searchBooks(query);
        }
        else { alert ("Enter a search term"); }
    });


    $('#searchTerm').keydown(function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            $('#searchButton').click();
        }
    });


    $('#results').on('click', '.book', function () {
        const bookId = $(this).data('id');
        const book = books.find(b => b.id === bookId);
        displayBookDetails(book);
    });


    $('#pagination').on('click', '.page-link', function () {
        const page = $(this).data('page');
        currentPage = page;
        const query = $('#searchTerm').val();
        searchBooks(query, currentPage);
    });


    function displayBookDetails(book) {
        const details = `
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.description || 'No description available.'}</p>
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg'}" alt="${book.volumeInfo.title}">
        `;
        $('#bookDetails').html(details);
    }


    function displayBookshelf(books) {
        $('#bookshelf').empty();
        books.forEach(book => {
            $('#bookshelf').append(`
                <div class="book" data-id="${book.id}">
                    <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
                    <p>${book.volumeInfo.title}</p>
                </div>
            `);
        });
    }


    loadBookshelf();
});
