import "./style.css";
import { Game } from "./game";
import { LoadScene } from "./scenes";

document.addEventListener("contextmenu", (event) => event.preventDefault());

Game.initialize(0xffffff);
Game.changeScene(new LoadScene());

const container = document.getElementById("mousePosition");
window.addEventListener("mousemove", (event) => {
  container!.innerHTML = `x: ${event.clientX} y: ${event.clientY}`;
});
