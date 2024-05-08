const API_KEY = 'e6038c6a7e79856caa9b9ff029cf280d';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POSTER_URL = 'default_poster.jpg'; // URL untuk poster default

// Fungsi untuk mendapatkan film terbaru dari API TMDb
function getLatestIndonesianMovies() {
    const API_KEY = 'e6038c6a7e79856caa9b9ff029cf280d';
    const URL = 'https://api.themoviedb.org/3/discover/movie';

    // Parameter untuk mendapatkan film Indonesia terbaru
    const params = new URLSearchParams({
        api_key: API_KEY,
        with_original_language: 'id', // Hanya film dengan bahasa Indonesia
        sort_by: 'release_date.desc', // Urutkan berdasarkan tanggal rilis (baru ke lama)
        include_adult: false, // Hanya film non-dewasa
        region: 'ID', // Hanya film yang dirilis di Indonesia
        language: 'id-ID', // Bahasa response (Bahasa Indonesia)
        page: 1, // Halaman pertama
        primary_release_year: new Date().getFullYear() // Film terbaru tahun ini
    });

    return fetch(`${URL}?${params}`)
        .then(response => response.json())
        .then(data => data.results)
        .catch(error => {
            console.error('Error fetching latest Indonesian movies:', error);
            return [];
        });
}

// Fungsi untuk menampilkan pop-up iklan film terbaru
function displayLatestIndonesianMoviePopup() {
    const isFirstVisit = localStorage.getItem('isFirstVisit');

    if (!isFirstVisit) {
        getLatestIndonesianMovies()
            .then(movies => {
                if (movies.length > 0) {
                    const latestMovie = movies[0]; // Ambil film terbaru

                    // Buat pop-up
                    const popup = document.createElement('div');
                    popup.classList.add('popup');

                    // Isi pop-up dengan informasi film
                    const title = document.createElement('h2');
                    title.textContent = latestMovie.title;

                    const poster = document.createElement('img');
                    poster.src = 'siksa_kubur_poster.jpg'; // Gunakan poster "Siksa Kubur"
                    poster.alt = latestMovie.title;
                    poster.classList.add('popup-poster');

                    const description = document.createElement('p');
                    description.textContent = latestMovie.overview;
                    description.classList.add('popup-description');

                    // Tambahkan tombol close (dengan ikon "x")
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = '<i class="fas fa-times"></i>';
                    closeButton.classList.add('close-button');
                    closeButton.addEventListener('click', () => {
                        popup.remove(); // Hapus pop-up saat tombol close diklik
                    });

                    // Tambahkan informasi dan tombol close ke dalam pop-up
                    popup.appendChild(title);
                    popup.appendChild(poster);
                    popup.appendChild(description);
                    popup.appendChild(closeButton);

                    // Tambahkan pop-up ke dalam body
                    document.body.appendChild(popup);

                    // Set flag untuk menandai pengguna telah mengunjungi halaman ini
                    localStorage.setItem('isFirstVisit', 'false');
                }
            });
    }
}

// Panggil fungsi untuk menampilkan pop-up iklan film terbaru saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    displayLatestIndonesianMoviePopup();
});

function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (query === '') {
        alert('Please enter a search query.');
        return;
    }

    const url = `${BASE_URL}?api_key=${API_KEY}&query=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Fungsi untuk mendapatkan daftar film populer dari API TMDb
function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => data.results)
        .catch(error => {
            console.error('Error fetching popular movies:', error);
            return [];
        });
}

// Fungsi untuk menampilkan daftar film populer di halaman utama
function displayPopularMovies() {
    const popularMoviesContainer = document.getElementById('popularMovies');
    
    getPopularMovies()
        .then(movies => {
            popularMoviesContainer.innerHTML = '';

            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');

                const title = document.createElement('h2');
                title.textContent = movie.title;

                const poster = document.createElement('img');
                poster.src = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : DEFAULT_POSTER_URL;
                poster.alt = movie.title;

                // Tambahkan event listener untuk menampilkan pop-up ketika film diklik
                movieElement.addEventListener('click', () => {
                    displayMovieDetail(movie);
                });

                movieElement.appendChild(poster);
                movieElement.appendChild(title);

                popularMoviesContainer.appendChild(movieElement);
            });
        });
}

// Variabel global untuk menyimpan status pop-up
let isPopupOpen = false;

function displayMovies(movies) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const title = document.createElement('h2');
        title.textContent = movie.title;

        const poster = document.createElement('img');
        poster.src = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : DEFAULT_POSTER_URL;
        poster.alt = movie.title;

        // Tambahkan event listener untuk menampilkan pop-up ketika film diklik
        movieElement.addEventListener('click', () => {
            displayMovieDetail(movie);
        });

        movieElement.appendChild(poster);
        movieElement.appendChild(title);

        resultsContainer.appendChild(movieElement);
    });
}

function displayMovieDetail(movie) {
    // Buat pop-up
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Isi pop-up dengan informasi film
    const title = document.createElement('h2');
    title.textContent = movie.title;

    const poster = document.createElement('img');
    poster.src = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : DEFAULT_POSTER_URL;
    poster.alt = movie.title;
    poster.classList.add('popup-poster');
    
    popup.style.animation = 'fadeIn 0.3s ease forwards';

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${movie.vote_average}`;
    
    const shareWhatsAppButton = createShareButton('WhatsApp', movie, 'fab fa-whatsapp');
    const shareFacebookButton = createShareButton('Facebook', movie, 'fab fa-facebook');
    const shareInstagramButton = createShareButton('Instagram', movie, 'fab fa-instagram');

    const description = document.createElement('p');
    description.textContent = movie.overview;
    description.classList.add('popup-description');

    const watchTrailerButton = document.createElement('button');
    watchTrailerButton.innerHTML = '<i class="fas fa-play"></i> Watch Trailer';
    watchTrailerButton.classList.add('watch-trailer-button');

    // Ambil kunci (key) trailer dari objek movie
    const trailerKey = movie.trailer_key;

    if (trailerKey) {
        // Jika ada kunci trailer, buat URL trailer menggunakan kunci tersebut
        const trailerURL = `https://www.youtube.com/watch?v=${trailerKey}`;
        
        watchTrailerButton.addEventListener('click', () => {
            // Arahkan pengguna ke URL trailer film saat tombol "Watch Trailer" diklik
            window.open(trailerURL, '_blank');
        });
    } else {
        // Jika tidak ada kunci trailer, tampilkan pesan bahwa trailer tidak tersedia
        watchTrailerButton.disabled = true;
        watchTrailerButton.textContent = 'Trailer not available';
    }

    popup.appendChild(title);
    popup.appendChild(poster);
    popup.appendChild(rating);
    popup.appendChild(shareWhatsAppButton);
    popup.appendChild(shareFacebookButton);
    popup.appendChild(shareInstagramButton);
    popup.appendChild(description);
    popup.appendChild(watchTrailerButton);

    // Tambahkan pop-up ke dalam body
    document.body.appendChild(popup);

    // Buat lapisan belakang (overlay)
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Tambahkan overlay ke dalam body
    document.body.appendChild(overlay);
    
    overlay.style.animation = 'fadeIn 0.3s ease forwards';

    // Tambahkan event listener untuk menutup pop-up ketika overlay diklik
    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
}

function closePopup() {
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    
    // Tambahkan animasi fadeOut
    popup.style.animation = 'fadeOut 0.3s ease forwards';
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    
    // Hapus pop-up setelah animasi selesai
    setTimeout(() => {
        popup.remove();
        overlay.remove();
    }, 300); // Sesuaikan dengan durasi animasi (0.3s)
}

function createShareButton(platform, movie, iconClass) {
    const button = document.createElement('button');
    button.classList.add('share-button');
    button.innerHTML = `<i class="${iconClass}"></i>`;

    button.addEventListener('click', () => {
        // Buat URL sharing berdasarkan platform dan informasi film
        const shareURL = createShareURL(platform, movie);
        // Buka URL sharing di tab baru
        window.open(shareURL, '_blank');
    });

    return button;
}

function createShareURL(platform, movie) {
    // Encode informasi tambahan dalam teks
    const movieInfo = `Title: ${encodeURIComponent(movie.title)}%0A` + // %0A adalah karakter newline yang diencode
                      `Rating: ${encodeURIComponent(movie.vote_average)}`;

    let shareText = encodeURIComponent(`Check out this movie: ${movie.title}`);
    let shareURL;

    switch(platform) {
        case 'WhatsApp':
            // Tambahkan informasi tambahan dan poster dalam teks yang akan dibagikan
            shareText += `%0A%0A${movieInfo}`;
            if (movie.poster_path) {
                const posterURL = IMAGE_BASE_URL + movie.poster_path;
                shareText += `%0A%0APoster: ${encodeURIComponent(posterURL)}`;
            }
            shareURL = `https://api.whatsapp.com/send?text=${shareText}`;
            break;
        case 'Facebook':
            // Tambahkan informasi tambahan dan poster dalam teks yang akan dibagikan
            shareText += `%0A%0A${movieInfo}`;
            if (movie.poster_path) {
                const posterURL = IMAGE_BASE_URL + movie.poster_path;
                shareText += `%0A%0APoster: ${encodeURIComponent(posterURL)}`;
            }
            shareURL = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${shareText}`;
            break;
        case 'Instagram':
            // Untuk Instagram, kita tidak bisa langsung membuat postingan, bisa berupa link di bio atau cerita
            shareURL = 'https://www.instagram.com/';
            break;
        // Tambahkan case untuk platform sosial media lainnya di sini
        default:
            shareURL = '#';
    }

    return shareURL;
}

// Panggil fungsi untuk menampilkan daftar film populer saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    displayPopularMovies();
});