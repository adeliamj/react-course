// Mengimpor library React untuk membuat komponen
import React from "react";

// Membuat komponen Search yang menerima properti searchTerm dan setSearchTerm
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search"> {/* Container utama untuk fitur pencarian */}
            <div>
                 {/* Menampilkan ikon pencarian */}
                <img src="search.svg" alt="search" />

                {/* Input pencarian */}
                <input
                    type="text" // Jenis input teks
                    placeholder="Search through thousands of movies"  // Placeholder untuk input
                    value={searchTerm} // Mengikat nilai input dengan state searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Mengupdate state searchTerm setiap kali pengguna mengetik
                />
            </div>
        </div>
    )
}
export default Search;

