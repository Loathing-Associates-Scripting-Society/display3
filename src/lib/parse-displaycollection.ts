/**
 * @file Provides methods for parsing displaycollection.php.
 */

import {print, xpath} from 'kolmafia';

/**
 * Represents a single display case shelf.
 */
export interface DisplayCaseShelf {
  /** Shelf name. The default shelf (shelf 0) has the name `"Display Case"`. */
  name: string;
  /**
   * Items in the shelf.
   * Items are usually sorted alphabetically (case-insensitive).
   */
  items: Map<Item, number>;
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

/**
 * Extracts the item and amount from the HTML for a Display Case table row.
 * @param row OuterHTML of the table row (`<tr/>`)
 * @return
 * @throws {Error}
 */
function parseShelfRow(row: string): [Item, number] {
  const descidMatch = /descitem\((\d+),\d+\)/.exec(row);
  if (!descidMatch) {
    throw new Error(`Cannot find item descid pattern in "${row}"`);
  }
  const descid = descidMatch[1];

  const nameMatch = /<b>(.+?)<\/b>(?:\s*\((\d+)\))?/i.exec(row);
  if (!nameMatch) {
    throw new Error(`Cannot find item name pattern in "${row}"`);
  }
  const itemName = unescapeEntitiesInItemName(nameMatch[1].trim());
  const itemCount = nameMatch[2] ? Number(nameMatch[2]) : 1;

  // Some items may have the same name. Thus, it is not safe to simply parse
  // an item by its name.
  let item = Item.get(itemName);
  if (item.descid !== descid) {
    print(
      `Item descid mismatch for '${itemName}': expected ${item.descid}, got ${descid}`
    );
    // Since KoL doesn't give us the item's ID, we must use the descid to search
    // for the correct item.
    const otherItem = Item.all().find(it => it.descid === descid);
    if (!otherItem) {
      throw new Error(`Cannot find item with descid: ${descid}`);
    }
    item = otherItem;
  }

  return [item, itemCount];
}

/**
 * Parse `displaycollection.php` and extract shelf information.
 * @param html HTML source of `displaycollection.php`
 * @return Array of shelves
 */
export function parseShelves(html: string): DisplayCaseShelf[] {
  return xpath(html, '//table//table//table[//font]').map(table => {
    const name = xpath(table, '//font/text()')[0];
    const items = new Map<Item, number>(
      xpath(table, '//table//table//tr').map(parseShelfRow)
    );

    return {name, items};
  });
}
