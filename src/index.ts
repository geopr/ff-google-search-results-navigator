import {
  isVisible,
  matchChildren,

  applyFocusStyle,
  applyBlurStyle,

  eventStream,
  matchKeys,
  cursorComputerFactory,
  accessByIndex,
} from './utils';

const resultLinks = (<HTMLAnchorElement[]>Array.from(document.querySelectorAll('a[data-ved][data-usg]')))
  .filter(isVisible)
  .filter(matchChildren);

for (const link of resultLinks) {
  link.addEventListener('focus', applyFocusStyle);
  link.addEventListener('blur', applyBlurStyle);
}

(async () => {
  const 
    computeCursor = cursorComputerFactory(resultLinks),
    getLinkByCursor = accessByIndex(resultLinks),
    stream = eventStream(document.body, 'keydown')
      .filter(matchKeys)
      .map(computeCursor)
      .map(getLinkByCursor);

  for await (const link of stream) {
    link?.scrollIntoView({ block: 'center' });
    link?.focus();
  }
})();

