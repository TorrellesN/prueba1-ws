import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "prueba 4 API",
        description: "exámen de DWES",
    },
    host: "localhost:8080",
};

const outputFile = "../doc/swagger.json";
const routes = ["../src/server.ts"];

swaggerAutogen()(outputFile, routes, doc);