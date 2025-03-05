// Mengimpor library React untuk membuat komponen
import React from 'react'

// Membuat komponen MovieCard yang menerima properti 'movie' yang berisi detail film
const MovieCard = ({ movie:
    { title, vote_average, poster_path, release_date, original_language }
}) => {
    return (
        <div className="movie-card"> {/* Container utama kartu film */}
            {/* Menampilkan poster film, jika tidak ada maka akan menggunakan gambar default */}
            <img
                src={poster_path ?
                    `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
                alt={title}
            />

            <div className="mt-4"> {/* Bagian dibawah poster berisi informasi film */}
                {/* Menampilkan judul film */}
                <h3>{title}</h3>

                {/* Container untuk rating, bahasa, dan tahun rilis */}
                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        {/* Menampilkan rating film dengan satu angka di belakang koma, jika tidak ada rating tampilkan 'N/A' */}
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    {/* Separator untuk tampilan lebih rapi */}
                    <span>•</span>
                    {/* Menampilkan bahasa asli film */}
                    <p className="lang">{original_language}</p>

                    <span>•</span>
                    {/* Menampilkan tahun rilis film dengan mengambil bagian pertama / indeks ke 0 dari format YYYY-MM-DD */}
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default MovieCard