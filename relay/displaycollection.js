/**
 * display3 - Display Case relay override script for KoLmafia
 * @version 0.1.2
 * @license MIT
 * @preserve
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kolmafia = require('kolmafia');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * @file Utilities for writing JavaScript code that runs in KoLmafia.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Represents an exception thrown when the current KoLmafia version does not
 * match an expected condition.
 */
var KolmafiaVersionError = /** @class */ (function (_super) {
    __extends(KolmafiaVersionError, _super);
    function KolmafiaVersionError(message) {
        var _this = _super.call(this, message) || this;
        // Explicitly set the prototype, so that 'instanceof' still works in Node.js
        // even when the class is transpiled down to ES5
        // See: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // Note that this code isn't needed for Rhino.
        Object.setPrototypeOf(_this, KolmafiaVersionError.prototype);
        return _this;
    }
    return KolmafiaVersionError;
}(Error));
// Manually set class name, so that the stack trace shows proper name in Rhino
KolmafiaVersionError.prototype.name = 'KolmafiaVersionError';
/**
 * Returns the currently executing script name, suitable for embedding in an
 * error message.
 * @returns Path of the main script wrapped in single-quotes, or `"This script"`
 *    if the path cannot be determined
 */
function getScriptName() {
    var _a;
    // In Rhino, the current script name is available in require.main.id
    var scriptName = (_a = require.main) === null || _a === void 0 ? void 0 : _a.id;
    return scriptName ? "'" + scriptName + "'" : 'This script';
}
/**
 * If KoLmafia's revision number is less than `revision`, throws an exception.
 * Otherwise, does nothing.
 *
 * This behaves like the `since rXXX;` statement in ASH.
 * @param revision Revision number
 * @throws {KolmafiaVersionError}
 *    If KoLmafia's revision number is less than `revision`.
 * @throws {TypeError} If `revision` is not an integer
 */
function sinceKolmafiaRevision(revision) {
    if (!Number.isInteger(revision)) {
        throw new TypeError("Invalid revision number " + revision + " (must be an integer)");
    }
    // Based on net.sourceforge.kolmafia.textui.Parser.sinceException()
    if (kolmafia.getRevision() < revision) {
        throw new KolmafiaVersionError(getScriptName() + " requires revision r" + revision + " of kolmafia or higher (current: " + kolmafia.getRevision() + "). Up-to-date builds can be found at https://ci.kolmafia.us/.");
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var vhtml = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	 module.exports = factory() ;
}(commonjsGlobal, (function () {
var emptyTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var esc = function esc(str) {
	return String(str).replace(/[&<>"']/g, function (s) {
		return '&' + map[s] + ';';
	});
};
var map = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' };
var setInnerHTMLAttr = 'dangerouslySetInnerHTML';
var DOMAttributeNames = {
	className: 'class',
	htmlFor: 'for'
};

var sanitized = {};

function h(name, attrs) {
	var stack = [],
	    s = '';
	attrs = attrs || {};
	for (var i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}

	if (typeof name === 'function') {
		attrs.children = stack.reverse();
		return name(attrs);
	}

	if (name) {
		s += '<' + name;
		if (attrs) for (var _i in attrs) {
			if (attrs[_i] !== false && attrs[_i] != null && _i !== setInnerHTMLAttr) {
				s += ' ' + (DOMAttributeNames[_i] ? DOMAttributeNames[_i] : esc(_i)) + '="' + esc(attrs[_i]) + '"';
			}
		}
		s += '>';
	}

	if (emptyTags.indexOf(name) === -1) {
		if (attrs[setInnerHTMLAttr]) {
			s += attrs[setInnerHTMLAttr].__html;
		} else while (stack.length) {
			var child = stack.pop();
			if (child) {
				if (child.pop) {
					for (var _i2 = child.length; _i2--;) {
						stack.push(child[_i2]);
					}
				} else {
					s += sanitized[child] === true ? child : esc(child);
				}
			}
		}

		s += name ? '</' + name + '>' : '';
	}

	sanitized[s] = true;
	return s;
}

return h;

})));

});

/**
 * @file Provides methods for parsing displaycollection.php.
 */
/**
 * Unescape problematic HTML entities in item names.
 * This is needed because KoLmafia's built-in `entityDecode()` does not escape
 * all entities.
 * @param str String with escaped HTML entities
 * @returns Unescaped string
 */
function unescapeEntitiesInItemName(str) {
    return str.replace(/&(\w+);/g, function (original, entity) {
        switch (entity) {
            case 'apos':
                return "'";
            default:
                return original;
        }
    });
}
var ITEM_NONE = Item.get('none');
var DESCID_TO_ITEM = new Map();
/**
 * @param descid
 * @return Item matching the descid, or the 'none' item if no match is found
 */
function findItemByDescid(descid) {
    if (DESCID_TO_ITEM.size === 0) {
        for (var _i = 0, _a = Item.all(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (DESCID_TO_ITEM.has(item.descid)) {
                kolmafia.print("Duplicate descid '" + item.descid + "' shared by " + DESCID_TO_ITEM.get(item.descid) + " and " + item);
            }
            else {
                DESCID_TO_ITEM.set(item.descid, item);
            }
        }
    }
    return DESCID_TO_ITEM.get(descid) || ITEM_NONE;
}
var itemsWithDuplicateNames = (function () {
    var itemsSeen = new Map();
    for (var _i = 0, _a = Item.all(); _i < _a.length; _i++) {
        var item = _a[_i];
        var itemsWithName = itemsSeen.get(item.name);
        if (!itemsWithName) {
            itemsSeen.set(item.name, (itemsWithName = []));
        }
        itemsWithName.push(item);
    }
    var duplicates = new Map();
    itemsSeen.forEach(function (items, name) {
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
function parseShelfRow(row) {
    var descidMatch = /descitem\((\d+),(\d+)\)/.exec(row);
    if (!descidMatch) {
        throw new Error("Cannot find item descid pattern in \"" + row + "\"");
    }
    var descid = descidMatch[1];
    var playerId = descidMatch[2];
    var nameMatch = /<b>(.+?)<\/b>(?:\s*\((\d+)\))?/i.exec(row);
    if (!nameMatch) {
        throw new Error("Cannot find item name pattern in \"" + row + "\"");
    }
    var itemName = unescapeEntitiesInItemName(nameMatch[1].trim());
    var itemCount = nameMatch[2] ? Number(nameMatch[2]) : 1;
    // If multiple items have the same name, `toItem()` prints a warning in the
    // gCLI. Avoid this by checking for duplicate names ourselves.
    var duplicates = itemsWithDuplicateNames.get(itemName);
    var item = duplicates === null || duplicates === void 0 ? void 0 : duplicates.find(function (it) { return it.descid === descid; });
    if (!item) {
        // Some items may have the same name. Thus, it is not safe to simply parse
        // an item by its name.
        item = kolmafia.toItem(itemName);
    }
    if (item === ITEM_NONE) {
        kolmafia.print("Unknown item name: " + itemName);
    }
    else if (item.descid !== descid) {
        kolmafia.print("Item descid mismatch for '" + itemName + "': expected " + item.descid + ", got " + descid);
        item = ITEM_NONE;
    }
    // If the item cannot be retrieved for, the only available hint is to check
    // the descid.
    if (item === ITEM_NONE) {
        item = findItemByDescid(descid);
        if (item === ITEM_NONE) {
            throw new Error("Cannot find item with descid: " + descid);
        }
    }
    return [item, itemCount, itemName, playerId];
}
var XPATH_SHELF_SELECTOR = '//table//table//table[.//table//span[@id]]';
/**
 * Parse `displaycollection.php` and extract shelf information.
 * @param html HTML source of `displaycollection.php`
 * @return Array of shelves
 */
function parseShelves(html) {
    return kolmafia.xpath(html, XPATH_SHELF_SELECTOR).map(function (table) {
        var name = kolmafia.xpath(table, '//font/text()')[0];
        var _playerId = '';
        var items = new Map(kolmafia.xpath(table, '//table//table//tr').map(function (row) {
            var _a = parseShelfRow(row), item = _a[0], amount = _a[1], displayCaseName = _a[2], playerId = _a[3];
            _playerId = playerId;
            return [item, { amount: amount, displayCaseName: displayCaseName }];
        }));
        return { name: name, items: items, playerId: _playerId };
    });
}

// Earliest version that supports JS-driven relay override scripts
sinceKolmafiaRevision(20550);
/**
 *
 * @param props
 * @param props.name Shelf name
 * @param props.items Map of items and their amounts in the shelf
 * @param props.playerId ID of the owner of the Display Case (not the current player)
 */
function MultiColumnShelfTable(props) {
    var name = props.name, items = props.items, playerId = props.playerId;
    return (vhtml("details", { class: "display3-shelf", open: true },
        vhtml("summary", { class: "display3-shelf__title", dangerouslySetInnerHTML: { __html: name }, title: "Click to hide/show" }),
        vhtml("div", { class: "display3-shelf__items" }, Array.from(items.entries())
            .sort(function (_a, _b) {
            var item1 = _a[0];
            var item2 = _b[0];
            return item1.name.toLowerCase().localeCompare(item2.name.toLowerCase());
        })
            .map(function (_a) {
            var item = _a[0], _b = _a[1], amount = _b.amount, displayCaseName = _b.displayCaseName;
            return (vhtml("div", { class: "display3-shelf__item" },
                vhtml("div", { class: "display3-shelf__item-icon" },
                    vhtml("img", { src: "//images.kingdomofloathing.com/itemimages/" + item.image, onclick: "descitem(" + item.descid + "," + playerId + ")" })),
                vhtml("div", { class: "display3-shelf__item-content" },
                    vhtml("a", { class: "display3-shelf__item-name", href: "desc_item.php?whichitem=" + item.descid + "&otherplayer=" + playerId, target: "_blank", onclick: "descitem(" + item.descid + "," + playerId + "); return false", dangerouslySetInnerHTML: { __html: displayCaseName } }),
                    amount !== 1 && (vhtml("span", { class: "display3-shelf__item-count" },
                        "(",
                        amount,
                        ")")))));
        }))));
}
/**
 * Relay override script entrypoint
 */
function main() {
    var html = kolmafia.visitUrl();
    // Extract shelf data
    var shelves = parseShelves(html);
    // Find the position of the closing </head> tag, so that we can inject our CSS
    // right before it
    var closingHeadTagMatch = /<\/head>/i.exec(html);
    if (!closingHeadTagMatch) {
        throw new Error('Cannot find closing HEAD tag. The HTML may be corrupted.');
    }
    var cssInjectPos = closingHeadTagMatch.index;
    // Find the end of the Display Case description table, which is immediately
    // followed by the original Display Case shelves
    var descriptionTableEndMatch = /<\/table>/i.exec(html);
    if (!descriptionTableEndMatch) {
        throw new Error('Cannot find end of description table');
    }
    var vanillaTableSearchPos = descriptionTableEndMatch.index + descriptionTableEndMatch[0].length;
    // Sanity check
    if (cssInjectPos > vanillaTableSearchPos) {
        throw new Error('TABLE tag is inside HEAD tag, wtf');
    }
    // Find the vanilla Display Case shelves
    var vanillaTableSectionPattern = /<center>.*?<td height=4><\/td><\/tr><\/table><\/center>/gi;
    vanillaTableSectionPattern.lastIndex = vanillaTableSearchPos;
    var vanillaTableSectionMatch = vanillaTableSectionPattern.exec(html);
    if (!vanillaTableSectionMatch) {
        throw new Error('Cannot extract display case markup. Please update Display3 or contact the author.');
    }
    // ...and remember their position.
    var tableReplaceStartPos = vanillaTableSectionMatch.index;
    var tableReplaceEndPos = vanillaTableSectionMatch.index + vanillaTableSectionMatch[0].length;
    // Find the closing tag for the <table> that wraps both the description table
    // and the original DC shelves
    var wrapperTableEndPattern = /<\/table>/gi;
    wrapperTableEndPattern.lastIndex = tableReplaceEndPos;
    var wrapperTableEndMatch = wrapperTableEndPattern.exec(html);
    if (!wrapperTableEndMatch) {
        throw new Error('Cannot find end of wrapper table. Please update Display3 or contact the author.');
    }
    var wrapperTableEndPos = wrapperTableEndMatch.index + wrapperTableEndMatch[0].length;
    // Finally, build the modified page
    kolmafia.write(html.slice(0, cssInjectPos));
    kolmafia.write(vhtml("link", { rel: "stylesheet", href: "/display3/display3.css" }));
    kolmafia.write(html.slice(cssInjectPos, tableReplaceStartPos));
    kolmafia.write(html.slice(tableReplaceEndPos, wrapperTableEndPos));
    kolmafia.write(vhtml(null, null, shelves.map(function (shelf) { return (vhtml(MultiColumnShelfTable, __assign({}, shelf))); })));
    kolmafia.write(html.slice(wrapperTableEndPos));
}

exports.main = main;
