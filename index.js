const express = require('express');
const main = require('./db')
const cors = require('cors')
const userRoutes = require('./routes/UserRoutes');
const folderRoutes = require('./routes/FolderRoutes');
const imageRoutes = require('./routes/ImageRoutes');

const app = express();
const PORT = process.env.PORT || 5000

main()
app.use(cors());
app.use(express.json());
app.use(express.static('Uploads'))

// Routes
app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

app.listen(PORT, ()=>{
    console.log('Server running on port ' + PORT + '.');
});
