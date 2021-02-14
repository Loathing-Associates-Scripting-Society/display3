/**
 * @file Provides mock class and methods for KoLmafia's Item global.
 * This module only provides the class; you must inject it into the global scope
 * yourself.
 */

/**
 * Exception class used to simulate KoLmafia internal errors
 */
export class JavaException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, JavaException.prototype);
  }
}

/**
 * Controls whether an Item can be instantiated.
 * This is NOT thread safe! Fortunately, JavaScript is single-threaded.
 */
export let allowInstantiateItem = false;

/**
 * Mock Item class
 */
export class Item {
  #name: string;
  // #tcrsName: string;
  // #plural: string;
  #descid: string;
  // #image: string;
  // #smallimage: string;
  // #levelreq: number;
  // #quality: string;
  // #adventures: string;
  // #muscle: string;
  // #mysticality: string;
  // #moxie: string;
  // #fullness: number;
  // #inebriety: number;
  // #spleen: number;
  // #minhp: number;
  // #maxhp: number;
  // #minmp: number;
  // #maxmp: number;
  // #dailyusesleft: number;
  // #notes: string;
  // #quest: boolean;
  // #gift: boolean;
  // #tradeable: boolean;
  // #discardable: boolean;
  // #combat: boolean;
  // #combatReusable: boolean;
  // #usable: boolean;
  // #reusable: boolean;
  // #multi: boolean;
  // #fancy: boolean;
  // #pasteable: boolean;
  // #smithable: boolean;
  // #cookable: boolean;
  // #mixable: boolean;
  // #candy: boolean;
  // #candyType: string;
  // #chocolate: boolean;
  // #seller: Coinmaster;
  // #buyer: Coinmaster;
  // #nameLength: number;
  // #noobSkill: Skill;

  constructor(o: {name: string; descid: string}) {
    // KoLmafia forbids users from instantiating custom Item objects
    if (!allowInstantiateItem) {
      throw new JavaException(
        'java.lang.InstantiationException: net.sourceforge.kolmafia.textui.javascript.EnumeratedWrapper'
      );
    }

    this.#name = o.name;
    this.#descid = o.descid;
  }

  // KoLmafia's record proxies use getters for properties
  get name() {
    return this.#name;
  }
  get tcrsName() {
    throw Error('mock not implemented');
  }
  get plural() {
    throw Error('mock not implemented');
  }
  get descid() {
    return this.#descid;
  }
  get image() {
    throw Error('mock not implemented');
  }
  get smallimage() {
    throw Error('mock not implemented');
  }
  get levelreq() {
    throw Error('mock not implemented');
  }
  get quality() {
    throw Error('mock not implemented');
  }
  get adventures() {
    throw Error('mock not implemented');
  }
  get muscle() {
    throw Error('mock not implemented');
  }
  get mysticality() {
    throw Error('mock not implemented');
  }
  get moxie() {
    throw Error('mock not implemented');
  }
  get fullness() {
    throw Error('mock not implemented');
  }
  get inebriety() {
    throw Error('mock not implemented');
  }
  get spleen() {
    throw Error('mock not implemented');
  }
  get minhp() {
    throw Error('mock not implemented');
  }
  get maxhp() {
    throw Error('mock not implemented');
  }
  get minmp() {
    throw Error('mock not implemented');
  }
  get maxmp() {
    throw Error('mock not implemented');
  }
  get dailyusesleft() {
    throw Error('mock not implemented');
  }
  get notes() {
    throw Error('mock not implemented');
  }
  get quest() {
    throw Error('mock not implemented');
  }
  get gift() {
    throw Error('mock not implemented');
  }
  get tradeable() {
    throw Error('mock not implemented');
  }
  get discardable() {
    throw Error('mock not implemented');
  }
  get combat() {
    throw Error('mock not implemented');
  }
  get combatReusable() {
    throw Error('mock not implemented');
  }
  get usable() {
    throw Error('mock not implemented');
  }
  get reusable() {
    throw Error('mock not implemented');
  }
  get multi() {
    throw Error('mock not implemented');
  }
  get fancy() {
    throw Error('mock not implemented');
  }
  get pasteable() {
    throw Error('mock not implemented');
  }
  get smithable() {
    throw Error('mock not implemented');
  }
  get cookable() {
    throw Error('mock not implemented');
  }
  get mixable() {
    throw Error('mock not implemented');
  }
  get candy() {
    throw Error('mock not implemented');
  }
  get candyType() {
    throw Error('mock not implemented');
  }
  get chocolate() {
    throw Error('mock not implemented');
  }
  get seller() {
    throw Error('mock not implemented');
  }
  get buyer() {
    throw Error('mock not implemented');
  }
  get nameLength() {
    throw Error('mock not implemented');
  }
  get noobSkill() {
    throw Error('mock not implemented');
  }

  toString(): string {
    return this.#name;
  }

  /**
   * @return New array containing all known Item objects
   */
  static all(): Item[] {
    return [...ALL_ITEMS];
  }

  /**
   * @param name Item name
   * @return Item matching the name
   * @throws {JavaException} If no item matches the given name
   */
  static get(name: string): Item {
    const item = ITEMS_BY_NAME.get(name.trim().toLowerCase());
    if (!item) {
      throw new JavaException(
        `net.sourceforge.kolmafia.textui.ScriptException: Bad item value: ${name}`
      );
    }
    return item;
  }
}

// Item static methods are unwritable
Object.freeze(Item);

allowInstantiateItem = true;

/**
 * The 'none' item instance.
 */
export const ITEM_NONE = new Item({name: 'none', descid: ''});

/**
 * All known items. This ensures that `Item.get()` always returns the same
 * object instance.
 */
const ALL_ITEMS = [
  ITEM_NONE,
  new Item({name: 'anniversary balsa wood socks', descid: '843314870'}),
  new Item({name: 'Asleep in the Cemetery', descid: '801300658'}),
  new Item({name: 'Blizzards I Have Died In', descid: '374672848'}),
  new Item({name: 'Book of Old-Timey Carols', descid: '908927941'}),
  new Item({name: 'box of sunshine', descid: '151059179'}),
  new Item({name: 'Crimbo Candy Cookbook', descid: '294757522'}),
  new Item({name: 'Crimbo smile', descid: '485610584'}),
  new Item({name: 'deck of tropical cards', descid: '750777542'}),
  new Item({name: 'easter egg balloon', descid: '787370659'}),
  new Item({name: 'enchanted leopard-print barbell', descid: '898724678'}),
  new Item({name: 'Let Me Be!', descid: '183602575'}),
  new Item({name: 'lewd playing card', descid: '683821625'}),
  new Item({name: 'Maxing, Relaxing', descid: '664515385'}),
  new Item({name: 'mummy costume', descid: '668178244'}),
  new Item({name: 'oyster egg balloon', descid: '975224635'}),
  new Item({name: 'Pan-Dimensional Gargle Blaster', descid: '671956082'}),
  new Item({name: 'Prelude of Precision', descid: '243581726'}),
  new Item({name: 'pumpkinhead mask', descid: '285361947'}),
  new Item({name: 'puzzling ribbon', descid: '296832113'}),
  new Item({name: 'really dense meat stack', descid: '714527088'}),
  new Item({name: 'SalesCo sample kit', descid: '731340264'}),
  new Item({name: 'sandwich of the gods', descid: '646801760'}),
  new Item({name: 'Sensual Massage for Creeps', descid: '543030767'}),
  new Item({name: 'solid gold bowling ball', descid: '642797054'}),
  new Item({name: 'spandex anniversary shorts', descid: '259836862'}),
  new Item({name: 'Summer Nights', descid: '682348153'}),
  new Item({name: 'Tales from the Fireside', descid: '186707798'}),
  new Item({name: 'The Art of Slapfighting', descid: '949615276'}),
  new Item({name: 'Travels with Jerry', descid: '499215664'}),
  new Item({name: 'Uncle Romulus', descid: '478200390'}),
  new Item({name: 'wolfman mask', descid: '631779409'}),
  new Item({name: 'Zu Mannkäse Dienen', descid: '398556198'}),
  new Item({
    name: "A Beginner's Guide to Charming Snakes",
    descid: '245745289',
  }),
  new Item({name: "Benetton's Medley of Diversity", descid: '258185206'}),
  new Item({
    name: "Biddy Cracker's Old-Fashioned Cookbook",
    descid: '136121854',
  }),
  new Item({name: "Ellsbury's journal (used)", descid: '715682439'}),
  new Item({name: "Elron's Explosive Etude", descid: '220021939'}),
  new Item({name: "Frosty's iceball", descid: '380631575'}),
  new Item({name: "Hodgman's varcolac paw", descid: '307397478'}),
  new Item({name: "Inigo's Incantation of Inspiration", descid: '629749615'}),
  new Item({name: "Kissin' Cousins", descid: '831722443'}),
  new Item({name: "Ol' Scratch's ash can", descid: '878278248'}),
  new Item({name: "Oscus's garbage can lid", descid: '203629025'}),
  new Item({name: "Spellbook: Drescher's Annoying Noise", descid: '198964664'}),
  new Item({name: "Zombo's empty eye", descid: '166850527'}),
  new Item({name: "Zombo's grievous greaves", descid: '587267531'}),
  new Item({name: 'Love Potion #0', descid: '863678027'}),
];
allowInstantiateItem = false;

/**
 * Item lookup table by name (lowercase).
 */
const ITEMS_BY_NAME = new Map<string, Item>(
  ALL_ITEMS.map(item => [item.name.toLowerCase(), item])
);

/**
 * Item lookup table by descid
 */
const ITEMS_BY_DESCID = new Map<string, Item>(
  ALL_ITEMS.map(item => [item.descid, item])
);

/**
 * Facsimilie implementation of KoLmafia's `descToItem()`.
 * @param descid
 */
export function descToItem(descid: string): Item {
  return ITEMS_BY_DESCID.get(descid) ?? ITEM_NONE;
}
