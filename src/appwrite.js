import { Client, Databases, ID, Query } from 'appwrite' // Mengimpor kelas-kelas yang diperlukan dari SDK Appwrite untuk berinteraksi dengan database

// Mendapatkan nilai project ID, database ID, dan collection ID dari environment variables
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; 

// Membuat objek client untuk menghubungkan ke server Appwrite dan mengatur endpoint serta project ID
const client = new Client() 
  .setEndpoint('https://cloud.appwrite.io/v1') // Menetapkan endpoint untuk Appwrite Cloud
  .setProject(PROJECT_ID) // Menetapkan ID proyek yang digunakan

  // Membuat objek database untuk mengakses fungsi-fungsi terkait database menggunakan client yang sudah diatur
const database = new Databases(client);

// Fungsi untuk memperbarui jumlah pencarian (search count) pada database
export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database |  Menggunakan SDK Appwrite untuk memeriksa apakah searchTerm sudah ada di database
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', searchTerm),  // Menyaring dokumen berdasarkan 'searchTerm' yang sama
  ])

  // 2. If it does, update the count | Jika searchTerm sudah ada, maka update count pencarian
  if(result.documents.length > 0) { // Jika ada dokumen yang cocok
   const doc = result.documents[0]; // // Ambil dokumen pertama (karena searchTerm hanya bisa satu hasil)

   // Update jumlah pencarian dengan menambah 1
   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1, // Tambahkan 1 ke nilai count yang ada
   })
  // 3. If it doesn't, create a new document with the search term and count as 1 | Jika searchTerm belum ada, buat dokumen baru dengan searchTerm dan count 1
  } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm, // Menyimpan searchTerm yang diberikan
    count: 1,  // Menetapkan count awal sebagai 1
    movie_id: movie.id, // Menyimpan ID film yang terkait
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // Menyimpan URL poster film
   })
  }
 } catch (error) {
  console.error(error); // Menangani error dengan mencetaknya ke konsol jika terjadi kesalahan
 }
}

// Fungsi untuk mendapatkan film-film yang sedang tren berdasarkan jumlah pencarian terbanyak
export const getTrendingMovies = async () => {
 try {
    // engambil dokumen dari database yang diurutkan berdasarkan count secara menurun
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5), // Menentukan untuk mengambil hanya 5 dokumen teratas
    Query.orderDesc("count") // Mengurutkan berdasarkan count secara menurun (dari yang terbanyak)
  ])

  return result.documents; // Mengembalikan dokumen yang ditemukan
 } catch (error) {
  console.error(error); // Mengembalikan dokumen yang ditemukan
 }
}