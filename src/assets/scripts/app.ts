import logger from './logger';

/**
 * create a header and button
 * assign the logger function to the button.onclick
 */
function init(): void {
  const container =
    document.querySelector('#root') || document.createElement('div');
  container.className = 'container';

  const title = document.createElement('h1');
  title.className = 'title';
  title.innerHTML = 'hallo world!';

  const button = document.createElement('button');
  button.title = 'btn';
  button.innerHTML = 'click me to log!';
  button.onclick = logger;

  container.appendChild(title);
  container.appendChild(button);

  document.body.appendChild(container);
}

export default init;
