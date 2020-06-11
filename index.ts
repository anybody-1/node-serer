import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";
import * as path from "path";
import * as fs from "fs";

const server = http.createServer();
const publciDir = path.resolve(__dirname, "public");
server.on("request", (request: IncomingMessage, response: ServerResponse) => {
  const { method } = request;
  let { pathname, search } = url.parse(request.url);
  let contentPath = path.join(publciDir, pathname);
  let errPath = path.join(publciDir, "/404.html");
  if (pathname === "/") {
    contentPath = path.join(publciDir, "/index.html");
  }
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  fs.readFile(contentPath, (err, data) => {
    if (err) {
      console.log(err);
      if (err.errno === -4058) {
        response.statusCode = 404;
        fs.readFile(errPath, (err, data) => {
          response.end(data);
        });
      } else if (err.errno === -4068) {
        response.setHeader("Content-Type", "text/html;charset=utf-8");
        response.statusCode = 403;
        response.end("没有访问权限");
      } else {
        response.statusCode = 500;
        response.end("服务器异常");
      }
    } else {
      response.setHeader("Cache-Control", "public,max-age=100000");
      response.end(data);
    }
  });
});

server.listen(8888);
