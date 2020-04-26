import logger from "./logger";
import "./styles.scss";

const container = document.createElement("dir");
container.className = "container";

const title = document.createElement("h1");
title.className = "title";
title.innerHTML = "hallo world!";

const button = document.createElement("button");
button.title = "btn";
button.innerHTML = "click me to log!";
button.onclick = logger;

container.appendChild(title);
container.appendChild(button);

document.body.appendChild(container);
