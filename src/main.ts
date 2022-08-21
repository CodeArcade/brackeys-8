import "./style.css";
import { Application } from "pixi.js";

const app = new Application({
  resizeTo: window
})
document.body.appendChild(app.view);
