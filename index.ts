import express from "express";
import categories from "./routes/categories";
import libraryItems from "./routes/libraryItems";
import users from "./routes/users";
import auth from "./routes/auth";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/libraryitems", libraryItems);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = 5544;

app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
