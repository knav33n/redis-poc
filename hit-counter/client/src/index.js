import io from "socket.io-client";

const socket = io("http://localhost:9090");

socket.on("connect", () => {
  if (window.location.hash) {
    const hashID = window.location.hash.substring(1);
    socket.emit("hello", { hashID });
    socket.on("stats", (hits) => {
      document.querySelector("#hitCount").innerHTML = hits;
    });
  }
});
