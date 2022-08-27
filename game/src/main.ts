import "./style.css";
import { Game } from "./game";
import { LoadScene } from "./scenes";

document.addEventListener("contextmenu", (event) => event.preventDefault());

Game.initialize(0xd3e0ed);
Game.changeScene(new LoadScene());