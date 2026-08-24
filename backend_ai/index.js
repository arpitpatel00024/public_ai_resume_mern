const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 4000;

const path = require('path')

require('./conn');
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))

const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');

app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)


// // Serve static files from the build folder
// app.use(express.static(path.join(__dirname, "build")));

// // Catch-all route: send index.html for React Router
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`backend is running on port ${PORT}`);
});