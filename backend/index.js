const express = require('express');

const PORT = 3000;

const app = express();
app.use(express.static(path.join(__dirname, '../always-on-frontend/build')));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});