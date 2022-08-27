const express = require('express');
const path = require('path');

const PORT = 3000;

const app = express();
app.get('/overlay', (res) => res.sendFile(path.join(__dirname, '../always-on-frontend/build/index.html')));
app.use(express.static(path.join(__dirname, '../always-on-frontend/build')));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});