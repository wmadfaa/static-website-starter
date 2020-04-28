import {MDCRipple} from '@material/ripple';
import {MDCIconButtonToggle} from '@material/icon-button';

/**
 * init app scripts
 */
function init(): void {
  const selector = '.mdc-button, .mdc-card__primary-action';
  [].map.call(document.querySelectorAll(selector), function (el) {
    return new MDCRipple(el);
  });
  const iconBtn = document.querySelector('.mdc-icon-button');
  if (iconBtn) new MDCIconButtonToggle(iconBtn);
}

export default init;
