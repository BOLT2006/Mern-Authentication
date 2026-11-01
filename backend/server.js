import app from "./src/app.js";
import connectDB from "./src/db/database.js";

const PORT = process.env.PORT || 3000;

connectDB()

app.listen(PORT , () => {
    console.log(`Server is running on ${PORT} `)
})