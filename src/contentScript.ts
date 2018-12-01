
const COLORS = ['green', 'yellow', 'orange', 'red', 'purple', 'blue', 'sky', 'lime', 'pink', 'black'];

type AttrMode =
  // Display in a header mode, and hide all labels, regardless of count
  'header' |
  // A single label is in use, so use its colour as background and hide it
  'single-label' |
  // Use background color if possible, but keep labels visible
  'normal';
const ATTR_MODE = 'enhanced-mode';
const ATTR_COLOR = 'enhanced-color';

const HEADER_TEXT_CLASS = 'enhanced-header-text';

function getDirectText(node: Element) {
  if (!node) return null;
  for (const c of node.childNodes) {
    if (c.nodeType === 3)
      return c.nodeValue;
  }
  return null;
}

function refreshCardDisplay(card: Element) {
  // Get the first label color used
  const labelContainer = card.getElementsByClassName('list-card-labels')[0];
  const labels = labelContainer ? labelContainer.children : [];
  let color = '';
  if (labels.length > 0) {
    const firstLabel = labels[0];
    for (const c of COLORS) {
      if (firstLabel.classList.contains(`card-label-${c}`))
        color = c;
    }
  }
  // Get the text content of the card
  const titleElement = card.getElementsByClassName('list-card-title')[0];
  let title = getDirectText(titleElement);
  if (title) title = title.trim();
  // Update Display
  let mode: AttrMode = 'normal';
  if (title && title.startsWith('--') && title.endsWith('--')) {
    mode = 'header';
    // Add filtered text component
    const filteredText = title.substr(2, title.length - 4).trim();
    let filteredTitleElement = card.getElementsByClassName(HEADER_TEXT_CLASS)[0];
    if (!filteredTitleElement && titleElement.parentNode) {
      filteredTitleElement = document.createElement('div');
      filteredTitleElement.classList.add(HEADER_TEXT_CLASS);
      titleElement.parentNode.insertBefore(filteredTitleElement, titleElement);
    }
    filteredTitleElement.textContent = filteredText;
  } else if (labels.length !== 1) {
    mode = 'single-label';
  }
  if (card.getAttribute(ATTR_MODE) !== mode)
    card.setAttribute(ATTR_MODE, mode);
  if (card.getAttribute(ATTR_COLOR) !== color)
    card.setAttribute(ATTR_COLOR, color);
  requireCheckForUnstyledCards();
}

function refreshAllCards() {
  const allCards = document.getElementsByClassName('list-card');
  for (let i = 0; i < allCards.length; i++) {
    refreshCardDisplay(allCards[i]);
  }
}

let checkForUnstyledCardsRequest = 0;

function checkForUnstyledCards() {
  const allCards = document.getElementsByClassName('list-card');
  for (let i = 0; i < allCards.length; i++) {
    const mode = allCards[i].getAttribute(ATTR_MODE);
    if (!mode) {
      refreshCardDisplay(allCards[i]);
    }
  }
}

function requireCheckForUnstyledCards() {
  cancelAnimationFrame(checkForUnstyledCardsRequest);
  checkForUnstyledCardsRequest = requestAnimationFrame(checkForUnstyledCards);
}

let refreshTimeout = 0;
const refreshSet = new Set<Element>();

function refreshRequiredCards() {
  clearTimeout(refreshTimeout);
  for (const card of refreshSet) {
    refreshCardDisplay(card);
  }
  refreshSet.clear();
}

function requireCardRefresh(card: Element) {
  refreshSet.add(card);
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(refreshRequiredCards, 0);
}

function init() {
  refreshAllCards();

  // Add mutation observer for cards (so changes can be tracked)
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.target && m.target instanceof HTMLElement) {
        const cardAncestor = m.target.closest('.list-card');
        if (cardAncestor &&
          !cardAncestor.classList.contains('list-card-quick-edit') && !cardAncestor.classList.contains('js-composer')
        ) {
          requireCardRefresh(cardAncestor);
        }
      }
    }
  });
  observer.observe(document, {attributes: true, childList: true, subtree: true});
}

init();
