/**
 * @file Provides methods for parsing displaycollection.php.
 */

// Double import so that KoLmafia globals are available in the generated D.TS
import 'kolmafia';
import {descToItem, xpath} from 'kolmafia';

/**
 * Represents a single display case shelf.
 */
export interface DisplayCaseShelf {
  /** Shelf name. The default shelf (shelf 0) has the name `"Display Case"`. */
  name: string;
  /** ID of the owner of the shelf */
  playerId: string;
  /**
   * Items in the shelf.
   * Items are usually sorted alphabetically (case-insensitive).
   */
  items: Map<Item, {amount: number; displayCaseName: string}>;
}

/**
 * Unescape problematic HTML entities in item names.
 * This is needed because KoLmafia's built-in `entityDecode()` does not escape
 * all entities.
 * @param str String with escaped HTML entities
 * @returns Unescaped string
 */
function unescapeEntitiesInItemName(str: string): string {
  return str.replace(/&(\w+);/g, (original, entity) => {
    switch (entity) {
      case 'apos':
        return "'";
      default:
        return original;
    }
  });
}

const ITEM_NONE = Item.get('none');

/**
 * Extracts the item and amount from the HTML for a Display Case table row.
 * @param row OuterHTML of the table row (`<tr/>`)
 * @return
 * @throws {Error}
 */
function parseShelfRow(
  row: string
): [item: Item, amount: number, displayCaseName: string, playerId: string] {
  const descidMatch = /descitem\((\d+),(\d+)\)/.exec(row);
  if (!descidMatch) {
    throw new Error(`Cannot find item descid pattern in "${row}"`);
  }
  const descid = descidMatch[1];
  const playerId = descidMatch[2];

  const nameMatch = /<b>(.+?)<\/b>(?:\s*\((\d+)\))?/i.exec(row);
  if (!nameMatch) {
    throw new Error(`Cannot find item name pattern in "${row}"`);
  }
  const itemName = unescapeEntitiesInItemName(nameMatch[1].trim());
  const itemCount = nameMatch[2] ? Number(nameMatch[2]) : 1;

  // Identifying an item by name is unreliable, since an item may have a
  // different name for each player, and multiple items may have the same name.
  // Instead, always check the descid, which is always unique.
  const item = descToItem(descid);

  if (item === ITEM_NONE) {
    throw new Error(`Item '${itemName}' has unknown descid: ${descid}`);
  }

  return [item, itemCount, itemName, playerId];
}

const XPATH_SHELF_SELECTOR = '//table//table//table[.//table//span[@id]]';

/**
 * Parse `displaycollection.php` and extract shelf information.
 * @param html HTML source of `displaycollection.php`
 * @return Array of shelves
 */
export function parseShelves(html: string): DisplayCaseShelf[] {
  return xpath(html, XPATH_SHELF_SELECTOR).map(table => {
    const name = xpath(table, '//font/text()')[0];
    let _playerId = '';

    const items = new Map(
      xpath(table, '//table//table//tr').map(row => {
        const [item, amount, displayCaseName, playerId] = parseShelfRow(row);
        _playerId = playerId;
        return [item, {amount, displayCaseName}];
      })
    );

    return {name, items, playerId: _playerId};
  });
}
