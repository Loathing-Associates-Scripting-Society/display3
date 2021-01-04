import {visitUrl, write} from 'kolmafia';
import {sinceKolmafiaRevision} from 'kolmafia-util';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import h from 'vhtml';

import {DisplayCaseShelf, parseShelves} from '../lib/parse-displaycollection';

// Earliest version that supports JS-driven relay override scripts
sinceKolmafiaRevision(20550);

/**
 *
 * @param props
 * @param props.name Shelf name
 * @param props.items Map of items and their amounts in the shelf
 * @param props.playerId ID of the owner of the Display Case (not the current player)
 */
function MultiColumnShelfTable(props: DisplayCaseShelf): JSX.Element {
  const {name, items, playerId} = props;
  return (
    <details class="display3-shelf" open>
      <summary
        class="display3-shelf__title"
        dangerouslySetInnerHTML={{__html: name}}
        title="Click to hide/show"
      ></summary>
      <div class="display3-shelf__items">
        {Array.from(items.entries())
          .sort(([item1], [item2]) =>
            item1.name.toLowerCase().localeCompare(item2.name.toLowerCase())
          )
          .map(([item, {amount, displayCaseName}]) => (
            <div class="display3-shelf__item">
              <div class="display3-shelf__item-icon">
                <img
                  src={`//images.kingdomofloathing.com/itemimages/${item.image}`}
                  onclick={`descitem(${item.descid},${playerId})`}
                />
              </div>
              <div class="display3-shelf__item-content">
                <span
                  class="display3-shelf__item-name"
                  onclick={`descitem(${item.descid},${playerId})`}
                  dangerouslySetInnerHTML={{__html: displayCaseName}}
                ></span>
                {amount !== 1 && (
                  <span class="display3-shelf__item-count">({amount})</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </details>
  );
}

/**
 * Relay override script entrypoint
 */
export function main(): void {
  const html = visitUrl();

  // Extract shelf data
  const shelves = parseShelves(html);

  // Find the position of the closing </head> tag, so that we can inject our CSS
  // right before it
  const closingHeadTagMatch = /<\/head>/i.exec(html);
  if (!closingHeadTagMatch) {
    throw new Error('Cannot find closing HEAD tag. The HTML may be corrupted.');
  }
  const cssInjectPos = closingHeadTagMatch.index;

  // Find the end of the Display Case description table, which is immediately
  // followed by the original Display Case shelves
  const descriptionTableEndMatch = /<\/table>/i.exec(html);
  if (!descriptionTableEndMatch) {
    throw new Error('Cannot find end of description table');
  }
  const vanillaTableSearchPos =
    descriptionTableEndMatch.index + descriptionTableEndMatch[0].length;

  // Sanity check
  if (cssInjectPos > vanillaTableSearchPos) {
    throw new Error('TABLE tag is inside HEAD tag, wtf');
  }

  // Find the vanilla Display Case shelves
  const vanillaTableSectionPattern = /<center>.*?<td height=4><\/td><\/tr><\/table><\/center>/gi;
  vanillaTableSectionPattern.lastIndex = vanillaTableSearchPos;
  const vanillaTableSectionMatch = vanillaTableSectionPattern.exec(html);
  if (!vanillaTableSectionMatch) {
    throw new Error(
      'Cannot extract display case markup. Please update Display3 or contact the author.'
    );
  }

  // ...and remember their position.
  const tableReplaceStartPos = vanillaTableSectionMatch.index;
  const tableReplaceEndPos =
    vanillaTableSectionMatch.index + vanillaTableSectionMatch[0].length;

  // Find the closing tag for the <table> that wraps both the description table
  // and the original DC shelves
  const wrapperTableEndPattern = /<\/table>/gi;
  wrapperTableEndPattern.lastIndex = tableReplaceEndPos;
  const wrapperTableEndMatch = wrapperTableEndPattern.exec(html);
  if (!wrapperTableEndMatch) {
    throw new Error(
      'Cannot find end of wrapper table. Please update Display3 or contact the author.'
    );
  }
  const wrapperTableEndPos =
    wrapperTableEndMatch.index + wrapperTableEndMatch[0].length;

  // Finally, build the modified page
  write(html.slice(0, cssInjectPos));
  write(<link rel="stylesheet" href="/display3/display3.css" />);
  write(html.slice(cssInjectPos, tableReplaceStartPos));
  write(html.slice(tableReplaceEndPos, wrapperTableEndPos));
  write(
    <>
      {shelves.map(shelf => (
        <MultiColumnShelfTable {...shelf} />
      ))}
    </>
  );
  write(html.slice(wrapperTableEndPos));
}
