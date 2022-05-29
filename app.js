
const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const cards = fs.readFileSync(`${__dirname}/templates/cards.html`, "utf-8");
const tempSnakeDetails = fs.readFileSync(`${__dirname}/templates/snake.html`, "utf-8");
const dataObj = JSON.parse(data);

// replace template
const replaceTemplate = (temp, snake) => {
    let output = temp.replace(/{%NAME%}/g, snake.snakeName);
    output = output.replace(/{%HABITAT%}/g, snake.habitat);
    output = output.replace(/{%PREY%}/g, snake.prey);
    output = output.replace(/{%DETAILS%}/g, snake.details);
    output = output.replace(/{%IMAGE%}/g, snake.image);

    return output;
}

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200, {"Content-type": "text/html"});

        const snakeOverview = dataObj.map(el => replaceTemplate(cards, el)).join();
        const output = tempOverview.replace("{%OVERVIEW_CARDS%}", snakeOverview);
        res.end(output);

    } else if(pathname === "/api") {
        res.writeHead(200, {"content-type" : "application/json"});

        res.end(data);

    } else {
        res.writeHead(200, {"Content-type": "text/html"});

        res.end("<h1>Error<h1/>");
    }
});

server.listen(8000, function(){
    console.log("Server started at port 8000.");
});