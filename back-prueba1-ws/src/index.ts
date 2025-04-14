import colors from 'colors';
import dotenv from "dotenv";
import server from "./server";
dotenv.config();

const port = process.env.PORT_DEFAULT || 8080;
server.listen(port, () => {
    console.log(colors.cyan.bold(`Escuchando por puerto ${port}`));
});