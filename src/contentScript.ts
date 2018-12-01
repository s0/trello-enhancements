
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

// const HEADER_CLASS = 'enhanced-header';
const HEADER_TEXT_CLASS = 'enhanced-header-text';
// const BG_CLASS = 'enhanced-bg';
// const SINGLE_LABELS_CLASS = 'enhanced-single-label';
// const COLOR_CLASS_PREFIX = 'enhanced-color-';

function getDirectText(node: JQuery<Element>) {
  const textNode =  node.contents().filter(function() {
    return this.nodeType === 3;
  })[0];
  return textNode ? textNode.nodeValue : null;
}

function refreshCardDisplay(card: JQuery<Element>) {
  // Get the first label color used
  const labels = card.find('.list-card-labels .card-label');
  let color: null | string = null;
  if (labels.length > 0) {
    const firstLabel = $(labels.get(0));
    for (const c of COLORS) {
      if (firstLabel.hasClass(`card-label-${c}`))
        color = c;
    }
  }
  // Get the text content of the card
  const titleElement = card.find('.list-card-title');
  let title = getDirectText(titleElement);
  if (title) title = title.trim();
  // Update Display
  let mode: AttrMode = 'normal';
  if (title && title.startsWith('--') && title.endsWith('--')) {
    mode = 'header';
    // Add filtered text component
    const filteredText = title.substr(2, title.length - 4).trim();
    let filteredTitleElement = card.find('.' + HEADER_TEXT_CLASS);
    if (filteredTitleElement.length === 0) {
      filteredTitleElement = $(document.createElement('div')).addClass(HEADER_TEXT_CLASS).insertAfter(titleElement);
    }
    filteredTitleElement.text(filteredText);
  } else if (labels.length !== 1) {
    mode = 'single-label';
  }
  // Set attributes
  card.attr(ATTR_MODE, mode);
  card.attr(ATTR_COLOR, color);
}

function refreshAllCards() {
  document.getElementsByClassName('list-card');
  const allCards = document.getElementsByClassName('list-card');
  for (let i = 0; i < allCards.length; i++) {
    refreshCardDisplay($(allCards[i]));
  }
}

let refreshing = false;
let refreshTimeout = 0;
const refreshSet = new Set<Element>();

function refreshRequiredCards() {
  refreshing = true;
  clearTimeout(refreshTimeout);
  for (const card of refreshSet) {
    refreshCardDisplay($(card));
  }
  refreshSet.clear();
  setTimeout(
    () => {
      refreshing = false;
    },
    0);
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
          !refreshing &&
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
