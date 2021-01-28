/**
 * @file Provides methods for parsing displaycollection.php.
 */

// Double import so that KoLmafia globals are available in the generated D.TS
import 'kolmafia';
import {print, toItem, xpath} from 'kolmafia';

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
const DESCID_TO_ITEM = new Map<string, Item>();

/**
 * @param descid
 * @return Item matching the descid, or the 'none' item if no match is found
 */
function findItemByDescid(descid: string): Item {
  if (DESCID_TO_ITEM.size === 0) {
    for (const item of Item.all()) {
      if (DESCID_TO_ITEM.has(item.descid)) {
        print(
          `Duplicate descid '${item.descid}' shared by ${DESCID_TO_ITEM.get(
            item.descid
          )} and ${item}`
        );
      } else {
        DESCID_TO_ITEM.set(item.descid, item);
      }
    }
  }
  return DESCID_TO_ITEM.get(descid) || ITEM_NONE;
}

const itemsWithDuplicateNames = (() => {
  const itemsSeen = new Map<string, Item[]>();
  for (const item of Item.all()) {
    let itemsWithName = itemsSeen.get(item.name);
    if (!itemsWithName) {
      itemsSeen.set(item.name, (itemsWithName = []));
    }
    itemsWithName.push(item);
  }
  const duplicates = new Map<string, Item[]>();
  itemsSeen.forEach((items, name) => {
    if (items.length > 1) {
      duplicates.set(name, items);
    }
  });
  return duplicates;
})();

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

  // If multiple items have the same name, `toItem()` prints a warning in the
  // gCLI. Avoid this by checking for duplicate names ourselves.
  const duplicates = itemsWithDuplicateNames.get(itemName);
  let item = duplicates?.find(it => it.descid === descid);

  if (!item) {
    // Some items may have the same name. Thus, it is not safe to simply parse
    // an item by its name.
    item = toItem(itemName);
  }

  if (item === ITEM_NONE) {
    print(`Unknown item name: ${itemName}`);
  } else if (item.descid !== descid) {
    print(
      `Item descid mismatch for '${itemName}': expected ${item.descid}, got ${descid}`
    );
    item = ITEM_NONE;
  }

  // If the item cannot be retrieved for, the only available hint is to check
  // the descid.
  if (item === ITEM_NONE) {
    item = findItemByDescid(descid);
    if (item === ITEM_NONE) {
      throw new Error(`Cannot find item with descid: ${descid}`);
    }
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
