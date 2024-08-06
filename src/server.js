const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 3000;
let students = [];

// Use the cors middleware
app.use(cors());

fs.createReadStream('students.csv')
  .pipe(csv())
  .on('data', (row) => {
    students.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// API endpoint to search by seat number or name with pagination
app.get('/search', (req, res) => {
  const { seat_num, name, method = 'includes', page = 1 } = req.query;
  const resultsPerPage = 20;
  let results = students;

  if (seat_num) {
    if (method === 'startsWith') {
        results = results.filter(student => student['﻿seat_num'].startsWith(seat_num));
    } else {
        results = results.filter(student => student['﻿seat_num'].includes(seat_num));
    }
  }
  if (name) {
    if (method === 'startsWith') {
      results = results.filter(student => student.name.startsWith(name));
    } else {
      results = results.filter(student => student.name.includes(name));
    }
  }

  // Pagination
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    currentPage: page,
    totalPages: Math.ceil(results.length / resultsPerPage),
    results: paginatedResults
  });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
