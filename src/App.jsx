import { useEffect, useState } from 'react' // Mengimpor hooks React untuk state dan efek
import Search from './components/Search.jsx' // Mengimpor komponen Search
import Spinner from './components/Spinner.jsx' // Mengimpor komponen Spinner untuk indikator loading
import MovieCard from './components/MovieCard.jsx' // Mengimpor komponen MovieCard untuk menampilkan film
import { useDebounce } from 'react-use' // Mengimpor useDebounce untuk mengurangi frekuensi pencarian API
import { getTrendingMovies, updateSearchCount } from "./AppWrite.js"; // Mengimpor fungsi untuk mendapatkan dan memperbarui data film

// URL dasar API TMDB
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Mengambil API key dari environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Opsi untuk permintaan API
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

// COMPONENT UTAMA
const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('') // State untuk menyimpan istilah pencarian setelah debounce
  const [searchTerm, setSearchTerm] = useState(''); // State untuk istilah pencarian yang dimasukkan pengguna

  const [movieList, setMovieList] = useState([]);  // State untuk menyimpan daftar film hasil pencarian
  const [errorMessage, setErrorMessage] = useState(''); // State untuk menyimpan pesan kesalahan jika terjadi error saat mengambil data
  const [isLoading, setIsLoading] = useState(false); // State untuk menunjukkan apakah data sedang dimuat

  const [trendingMovies, setTrendingMovies] = useState([]); // State untuk menyimpan daftar film yang sedang trending

  // Debounce the search term to prevent making too many API requests | Menggunakan debounce agar permintaan API tidak terlalu sering dilakukan
  // by waiting for the user to stop typing for 500ms | Memastikan permintaan API hanya dilakukan setelah pengguna berhenti mengetik selama 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // Fungsi untuk mengambil daftar film berdasarkan pencarian atau menampilkan film populer jika tidak ada pencarian
  const fetchMovies = async (query = '') => {
    setIsLoading(true); // Menampilkan indikator loading
    setErrorMessage(''); // Mengosongkan pesan error sebelum permintaan baru

    try {
      // Menentukan endpoint API berdasarkan apakah ada pencarian atau tidak
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Mengambil data dari API
      const response = await fetch(endpoint, API_OPTIONS);

      // Jika permintaan gagal, error
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      // Mengonversi response ke JSON
      const data = await response.json();

      // Jika API mengembalikan respons negatif, atur error message dan kosongkan daftar film
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      // Memperbarui daftar film berdasarkan hasil pencarian
      setMovieList(data.results || []);

      // Jika ada pencarian dan hasil tidak kosong, perbarui jumlah pencarian untuk query tersebut
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`); // Menampilkan error console
      setErrorMessage('Error fetching movies. Please try again later.'); // Menampilkan error ke pengguna
    } finally {
      setIsLoading(false); // Menghilangkan indikator loading setelah selesai
    }
  }

  // Fungsi untuk mengambil daftar film trending dari sumber eksternal
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // Mengambil data film trending

      setTrendingMovies(movies); // Menyimpan data dalam state
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`); // Menampilkan error jika ada kesalahan
    }
  }

  // useEffect untuk memuat film berdasarkan istilah pencarian setelah debounce
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // useEffect untuk mengambil film trending saat komponen pertama kali dimuat
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          {/* Komponen pencarian */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Menampilkan bagian film trending jika tersedia */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p> {/* Menampilkan nomor urutan */}
                  <img src={movie.poster_url} alt={movie.title} /> {/* Menampilkan poster film */}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bagian untuk menampilkan semua film */}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner /> // Menampilkan loading spinner saat data dimuat
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} /> // Menampilkan setiap film menggunakan MovieCard
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App // Mengekspor komponen App agar bisa digunakan di file lain