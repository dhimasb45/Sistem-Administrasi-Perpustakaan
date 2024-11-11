const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Set up Express server
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres', // ganti dengan username PostgreSQL Anda
    host: '172.24.39.62',
    database: 'perpustakaandb',
    password: 'postgres', // ganti dengan password PostgreSQL Anda
    port: 5432,
});

// API Endpoint untuk mendapatkan daftar buku
app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Buku');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API Endpoint untuk menambahkan buku
app.post('/books', async (req, res) => {
    const { judul, pengarang, penerbit, tahun_terbit } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Buku (judul, pengarang, penerbit, tahun_terbit, status_ketersediaan) VALUES ($1, $2, $3, $4, TRUE) RETURNING *',
            [judul, pengarang, penerbit, tahun_terbit]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API Endpoint untuk menghapus buku
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Buku WHERE id_buku = $1 RETURNING *', [id]);
        if (result.rowCount > 0) {
            res.json({ message: 'Buku berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Buku tidak ditemukan' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Menjalankan server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



