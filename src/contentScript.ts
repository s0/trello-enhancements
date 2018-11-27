
const COLORS = ['green', 'yellow', 'orange', 'red', 'purple', 'blue', 'sky', 'lime', 'pink', 'black'];

const HEADER_CLASS = 'enhanced-header';
const HEADER_TEXT_CLASS = 'enhanced-header-text';
const BG_CLASS = 'enhanced-bg';
const COLOR_CLASS_PREFIX = 'enhanced-color-';

const colorClass = (color: string) => COLOR_CLASS_PREFIX + color;

function getDirectText(node: JQuery<Element>) {
  return node.contents().filter(function(){
    return this.nodeType == 3;
  })[0].nodeValue;
}

function refreshCardDisplay(card: JQuery<Element>) {
  clearCardDisplay(card);
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
  if (title && title.startsWith('--') && title.endsWith('--')) {
    card.addClass(HEADER_CLASS)
    if (color)
      card.addClass(colorClass(color));
    // Add filtered text component
    const filteredText = title.substr(2, title.length - 4).trim();
    titleElement.after($(document.createElement('div')).addClass(HEADER_TEXT_CLASS).text(filteredText));
  } else if (color) {
    card.addClass(BG_CLASS);
    card.addClass(colorClass(color));
  }
}

function clearCardDisplay(card: JQuery<Element>) {
  if (card.hasClass(HEADER_CLASS)) {
    card.removeClass(HEADER_CLASS);
    card.find(HEADER_TEXT_CLASS).remove();
  }
  card.removeClass(BG_CLASS);
  for (const color of COLORS) card.removeClass(colorClass(color));
}

function refreshAllCards() {
  document.getElementsByClassName('list-card');
  const allCards = document.getElementsByClassName('list-card');
  for (let i = 0; i < allCards.length; i++) {
    refreshCardDisplay($(allCards[i]));
  }
}

function init() {
  refreshAllCards();
}

init();
