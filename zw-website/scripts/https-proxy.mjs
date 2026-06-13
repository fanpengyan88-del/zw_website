import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";

const listenHost = process.env.HTTPS_HOST || "0.0.0.0";
const listenPort = Number(process.env.HTTPS_PORT || 3000);
const targetHost = process.env.APP_HOST || "127.0.0.1";
const targetPort = Number(process.env.APP_PORT || 3001);
const pfxPath = process.env.HTTPS_PFX_PATH;
const passphrase = process.env.HTTPS_PFX_PASSWORD;

if (!pfxPath) {
  throw new Error("HTTPS_PFX_PATH is required.");
}

const forwardedHeaders = (request) => ({
  ...request.headers,
  host: request.headers.host,
  "x-forwarded-for": request.socket.remoteAddress || "",
  "x-forwarded-host": request.headers.host || "",
  "x-forwarded-proto": "https",
  "x-real-ip": request.socket.remoteAddress || "",
});

const server = https.createServer(
  {
    pfx: fs.readFileSync(pfxPath),
    passphrase,
    minVersion: "TLSv1.2",
  },
  (request, response) => {
    const proxyRequest = http.request(
      {
        host: targetHost,
        port: targetPort,
        method: request.method,
        path: request.url,
        headers: forwardedHeaders(request),
      },
      (proxyResponse) => {
        response.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
        proxyResponse.pipe(response);
      },
    );

    proxyRequest.on("error", (error) => {
      if (!response.headersSent) {
        response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
      }
      response.end(`HTTPS proxy error: ${error.message}`);
    });

    request.pipe(proxyRequest);
  },
);

server.on("upgrade", (request, clientSocket, head) => {
  const upstreamSocket = net.connect(targetPort, targetHost, () => {
    const headers = forwardedHeaders(request);
    const headerLines = Object.entries(headers)
      .flatMap(([name, value]) => {
        const values = Array.isArray(value) ? value : [value];
        return values.filter(Boolean).map((item) => `${name}: ${item}`);
      })
      .join("\r\n");

    upstreamSocket.write(
      `${request.method} ${request.url} HTTP/${request.httpVersion}\r\n${headerLines}\r\n\r\n`,
    );
    if (head.length) upstreamSocket.write(head);
    clientSocket.pipe(upstreamSocket).pipe(clientSocket);
  });

  upstreamSocket.on("error", () => clientSocket.destroy());
});

server.listen(listenPort, listenHost, () => {
  console.log(`HTTPS proxy listening on https://${listenHost}:${listenPort}`);
});
