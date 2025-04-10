import server from "./server";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT_DEFAULT || 8080;
server.listen(port, () => {
    console.log(`Escuchando por puerto ${port}`);
});