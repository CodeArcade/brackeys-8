import "./style.css";
import { Game } from "./game";
import { LoadScene } from "./scenes";

Game.initialize(0xFFFFFF);
Game.changeScene(new LoadScene());