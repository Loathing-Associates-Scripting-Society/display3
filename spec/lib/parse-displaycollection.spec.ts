import mock from 'mock-require';
import {xpath} from 'kolmafia-stubs';

mock('kolmafia', {
  getRevision: () => 20590,
  print(str: string): void {
    console.log(str);
  },
  xpath,
});

import {parseShelves} from '../../src/lib/parse-displaycollection';

/**
 * Mock Item class
 */
class MockItem {
  readonly name: string;
  readonly descid: string;

  private constructor(name: string, descid: string) {
    this.name = name;
    this.descid = descid;
  }

  toString(): string {
    return this.name;
  }

  /**
   * The 'none' item instance.
   */
  private static _none = new MockItem('none', '');

  /**
   * All known items. This ensures that `Item.get()` always returns the same
   * object instance.
   */
  private static _all = [
    MockItem._none,
    new MockItem('anniversary balsa wood socks', '843314870'),
    new MockItem('Asleep in the Cemetery', '801300658'),
    new MockItem('Blizzards I Have Died In', '374672848'),
    new MockItem('Book of Old-Timey Carols', '908927941'),
    new MockItem('box of sunshine', '151059179'),
    new MockItem('Crimbo Candy Cookbook', '294757522'),
    new MockItem('Crimbo smile', '485610584'),
    new MockItem('deck of tropical cards', '750777542'),
    new MockItem('easter egg balloon', '787370659'),
    new MockItem('enchanted leopard-print barbell', '898724678'),
    new MockItem('Let Me Be!', '183602575'),
    new MockItem('lewd playing card', '683821625'),
    new MockItem('Maxing, Relaxing', '664515385'),
    new MockItem('mummy costume', '668178244'),
    new MockItem('oyster egg balloon', '975224635'),
    new MockItem('Pan-Dimensional Gargle Blaster', '671956082'),
    new MockItem('Prelude of Precision', '243581726'),
    new MockItem('pumpkinhead mask', '285361947'),
    new MockItem('puzzling ribbon', '296832113'),
    new MockItem('really dense meat stack', '714527088'),
    new MockItem('SalesCo sample kit', '731340264'),
    new MockItem('sandwich of the gods', '646801760'),
    new MockItem('Sensual Massage for Creeps', '543030767'),
    new MockItem('solid gold bowling ball', '642797054'),
    new MockItem('spandex anniversary shorts', '259836862'),
    new MockItem('Summer Nights', '682348153'),
    new MockItem('Tales from the Fireside', '186707798'),
    new MockItem('The Art of Slapfighting', '949615276'),
    new MockItem('Travels with Jerry', '499215664'),
    new MockItem('Uncle Romulus', '478200390'),
    new MockItem('wolfman mask', '631779409'),
    new MockItem('Zu Mannkäse Dienen', '398556198'),
    new MockItem("A Beginner's Guide to Charming Snakes", '245745289'),
    new MockItem("Benetton's Medley of Diversity", '258185206'),
    new MockItem("Biddy Cracker's Old-Fashioned Cookbook", '136121854'),
    new MockItem("Ellsbury's journal (used)", '715682439'),
    new MockItem("Elron's Explosive Etude", '220021939'),
    new MockItem("Frosty's iceball", '380631575'),
    new MockItem("Hodgman's varcolac paw", '307397478'),
    new MockItem("Inigo's Incantation of Inspiration", '629749615'),
    new MockItem("Kissin' Cousins", '831722443'),
    new MockItem("Ol' Scratch's ash can", '878278248'),
    new MockItem("Oscus's garbage can lid", '203629025'),
    new MockItem("Spellbook: Drescher's Annoying Noise", '198964664'),
    new MockItem("Zombo's empty eye", '166850527'),
    new MockItem("Zombo's grievous greaves", '587267531'),
  ];

  /**
   * Lookup table by item name.
   */
  private static _cache = new Map<string, MockItem>(
    MockItem._all.map(it => [it.name.toLowerCase(), it])
  );

  static get(name: string): MockItem {
    const item = this._cache.get(name.trim().toLowerCase());
    if (!item) {
      throw new Error(`Unknown item name: ${name}`);
    }
    return item;
  }

  static all(): MockItem[] {
    return Array.from(this._all);
  }
}

(global as typeof global & {Item: typeof MockItem}).Item = MockItem;

/**
 * Test input HTML
 *
 * - Player name replaced with "Player Name"
 * - Player ID replaced with 1234567890
 */
const html = `<html><head>
<script language=Javascript>
<!--
if (parent.frames.length == -1) location.href="game.php";
var actions = { "sendmessage.php" : { "action" : 1, "title" : "Send Message", "arg" : "toid" }, "makeoffer.php" : { "action" : 1, "title" : "Propose Trade", "arg" : "towho" }, "mallstore.php" : { "action" : 1, "title" : "Mall Store", "arg" : "whichstore" }, "displaycollection.php" : { "action" : 1, "title" : "Display Case", "arg" : "who" }, "showfamiliars.php" : { "action" : 1, "title" : "View Familiars", "arg" : "who" }, "ascensionhistory.php" : { "action" : 1, "title" : "Ascension History", "arg" : "back=other&who" }, "showclan.php" : {"action":1, "title":"View Clan","arg":"pidlookup"}, "/whois" : { "action" : 2, "useid" : true, "submit" : true}, "/msg" : { "action" : 3, "useid" : true, "query" : "Enter message to send to %:" }, "/friend" : { "action" : 2, "useid" : true, "submit" : true }, "/ignore" : { "action" : 2, "useid" : true, "submit" : true } }
var notchat = true;//-->
</script>
<script language=Javascript src=https://s3.amazonaws.com/images.kingdomofloathing.com/scripts/core.js></script>
<script language=Javascript src=https://s3.amazonaws.com/images.kingdomofloathing.com/scripts/window.js></script><script language=Javascript src="https://s3.amazonaws.com/images.kingdomofloathing.com/scripts/jquery-1.3.1.min.js"></script>
<script language=Javascript src='https://s3.amazonaws.com/images.kingdomofloathing.com/scripts/rcm.20160406.js'></script>	<link rel="stylesheet" type="text/css" href="https://s3.amazonaws.com/images.kingdomofloathing.com/styles.20151006.css">
<style type='text/css'>
.faded {
	zoom: 1;
	filter: alpha(opacity=35);
	opacity: 0.35;
	-khtml-opacity: 0.35;
    -moz-opacity: 0.35;
}
</style>

<script language="Javascript" src="/basics.js"></script><link rel="stylesheet" href="/basics.1.css" /></head>

<body>
<div id='menu' class=rcm></div><centeR><table  width=95%  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b>Display Case (<a style='color: white; text-decoration: none;' href="showplayer.php?who=1234567890">Player Name</a>)</b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><table><tr><td valign=center><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/otherimages/museum/displaycase.gif" width=100 height=100></td><td valign=center>Collecting Rubber WWBD? bracelets(ID #1992).</td></tr></table><p><center><table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href='javascript:toggle("shelf0");' class=nounder><font color=white>Display Case</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id='shelf0'><table><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick='descitem(908927941,1234567890)'></td><td valign=center><b>Book of Old-Timey Carols</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/beardgrin.gif" class=hand onClick='descitem(485610584,1234567890)'></td><td valign=center><b>Crimbo smile</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/carddeck.gif" class=hand onClick='descitem(750777542,1234567890)'></td><td valign=center><b>deck of tropical cards</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/eggballoon.gif" class=hand onClick='descitem(787370659,1234567890)'></td><td valign=center><b>easter egg balloon</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/lepbell.gif" class=hand onClick='descitem(898724678,1234567890)'></td><td valign=center><b>enchanted leopard-print barbell</b> (12)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/lewdcard.gif" class=hand onClick='descitem(683821625,1234567890)'></td><td valign=center><b>lewd playing card</b> (3)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/wrapping.gif" class=hand onClick='descitem(668178244,1234567890)'></td><td valign=center><b>mummy costume</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/eggballoon.gif" class=hand onClick='descitem(975224635,1234567890)'></td><td valign=center><b>oyster egg balloon</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/chamfluteu.gif" class=hand onClick='descitem(671956082,1234567890)'></td><td valign=center><b>Pan-Dimensional Gargle Blaster</b> (12)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/familiar24.gif" class=hand onClick='descitem(285361947,1234567890)'></td><td valign=center><b>pumpkinhead mask</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/mystribbon.gif" class=hand onClick='descitem(296832113,1234567890)'></td><td valign=center><b>puzzling ribbon</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/meatstack.gif" class=hand onClick='descitem(714527088,1234567890)'></td><td valign=center><b>really dense meat stack</b> (4)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/briefcase.gif" class=hand onClick='descitem(731340264,1234567890)'></td><td valign=center><b>SalesCo sample kit</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/sammich.gif" class=hand onClick='descitem(646801760,1234567890)'></td><td valign=center><b>sandwich of the gods</b> (12)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/bowlingball.gif" class=hand onClick='descitem(642797054,1234567890)'></td><td valign=center><b>solid gold bowling ball</b> (16)</td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/wolfmanmask.gif" class=hand onClick='descitem(631779409,1234567890)'></td><td valign=center><b>wolfman mask</b></td></tr></table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table><table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href='javascript:toggle("shelf1");' class=nounder><font color=white>Birthday Stuff</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id='shelf1'><table><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/woodsocks.gif" class=hand onClick='descitem(843314870,1234567890)'></td><td valign=center><b>anniversary balsa wood socks</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/spandex.gif" class=hand onClick='descitem(259836862,1234567890)'></td><td valign=center><b>spandex anniversary shorts</b></td></tr></table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table><table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href='javascript:toggle("shelf2");' class=nounder><font color=white>Unexpected Gifts</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id='shelf2'><table><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/chromebox.gif" class=hand onClick='descitem(151059179,1234567890)'></td><td valign=center><b>box of sunshine</b> (4)</td></tr></table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table><table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href='javascript:toggle("shelf3");' class=nounder><font color=white>Dungeoneer's Dump</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id='shelf3'><table><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/styore.gif" class=hand onClick='descitem(380631575,1234567890)'></td><td valign=center><b>Frosty's iceball</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/varcolacpaw.gif" class=hand onClick='descitem(307397478,1234567890)'></td><td valign=center><b>Hodgman's varcolac paw</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/handcan.gif" class=hand onClick='descitem(878278248,1234567890)'></td><td valign=center><b>Ol' Scratch's ash can</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/trashield.gif" class=hand onClick='descitem(203629025,1234567890)'></td><td valign=center><b>Oscus's garbage can lid</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/zomboeye.gif" class=hand onClick='descitem(166850527,1234567890)'></td><td valign=center><b>Zombo's empty eye</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/bonepants.gif" class=hand onClick='descitem(587267531,1234567890)'></td><td valign=center><b>Zombo's grievous greaves</b></td></tr></table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table><table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href='javascript:toggle("shelf4");' class=nounder><font color=white>Skillbooks</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id='shelf4'><table><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(245745289,1234567890)'></td><td valign=center><b>A Beginner's Guide to Charming Snakes</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(801300658,1234567890)'></td><td valign=center><b>Asleep in the Cemetery</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif" class=hand onClick='descitem(258185206,1234567890)'></td><td valign=center><b>Benetton's Medley of Diversity</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(136121854,1234567890)'></td><td valign=center><b>Biddy Cracker's Old-Fashioned Cookbook</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(374672848,1234567890)'></td><td valign=center><b>Blizzards I Have Died In</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick='descitem(294757522,1234567890)'></td><td valign=center><b>Crimbo Candy Cookbook</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick='descitem(715682439,1234567890)'></td><td valign=center><b>Ellsbury's journal (used)</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif" class=hand onClick='descitem(220021939,1234567890)'></td><td valign=center><b>Elron's Explosive Etude</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif" class=hand onClick='descitem(629749615,1234567890)'></td><td valign=center><b>Inigo's Incantation of Inspiration</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(831722443,1234567890)'></td><td valign=center><b>Kissin' Cousins</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(183602575,1234567890)'></td><td valign=center><b>Let Me Be!</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(664515385,1234567890)'></td><td valign=center><b>Maxing, Relaxing</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif" class=hand onClick='descitem(243581726,1234567890)'></td><td valign=center><b>Prelude of Precision</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(543030767,1234567890)'></td><td valign=center><b>Sensual Massage for Creeps</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick='descitem(198964664,1234567890)'></td><td valign=center><b>Spellbook: Drescher's Annoying Noise</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(682348153,1234567890)'></td><td valign=center><b>Summer Nights</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(186707798,1234567890)'></td><td valign=center><b>Tales from the Fireside</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(949615276,1234567890)'></td><td valign=center><b>The Art of Slapfighting</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(499215664,1234567890)'></td><td valign=center><b>Travels with Jerry</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(478200390,1234567890)'></td><td valign=center><b>Uncle Romulus</b></td></tr><tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick='descitem(398556198,1234567890)'></td><td valign=center><b>Zu Mannk&auml;se Dienen</b></td></tr></table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table></center><p><center><a href="managecollection.php">Manage your Display Case</a></center><p><center><a href="museum.php?place=collections">Back to The Museum</a></center></td></tr></table></center></td></tr><tr><td height=4></td></tr></table></center></body><script src="/onfocus.1.js"></script></html>
`;

describe('displaycollection', () => {
  it('parseShelves()', () => {
    const shelves = parseShelves(html);

    const expectedShelves = [
      {
        name: 'Display Case',
        items: new Map([
          [MockItem.get('Book of Old-Timey Carols'), 1],
          [MockItem.get('Crimbo smile'), 1],
          [MockItem.get('deck of tropical cards'), 1],
          [MockItem.get('easter egg balloon'), 1],
          [MockItem.get('enchanted leopard-print barbell'), 12],
          [MockItem.get('lewd playing card'), 3],
          [MockItem.get('mummy costume'), 1],
          [MockItem.get('oyster egg balloon'), 1],
          [MockItem.get('Pan-Dimensional Gargle Blaster'), 12],
          [MockItem.get('pumpkinhead mask'), 1],
          [MockItem.get('puzzling ribbon'), 1],
          [MockItem.get('really dense meat stack'), 4],
          [MockItem.get('SalesCo sample kit'), 1],
          [MockItem.get('sandwich of the gods'), 12],
          [MockItem.get('solid gold bowling ball'), 16],
          [MockItem.get('wolfman mask'), 1],
        ]),
      },
      {
        name: 'Birthday Stuff',
        items: new Map([
          [MockItem.get('anniversary balsa wood socks'), 1],
          [MockItem.get('spandex anniversary shorts'), 1],
        ]),
      },
      {
        name: 'Unexpected Gifts',
        items: new Map([[MockItem.get('box of sunshine'), 4]]),
      },
      {
        name: "Dungeoneer's Dump",
        items: new Map([
          [MockItem.get("Frosty's iceball"), 1],
          [MockItem.get("Hodgman's varcolac paw"), 1],
          [MockItem.get("Ol' Scratch's ash can"), 1],
          [MockItem.get("Oscus's garbage can lid"), 1],
          [MockItem.get("Zombo's empty eye"), 1],
          [MockItem.get("Zombo's grievous greaves"), 1],
        ]),
      },
      {
        name: 'Skillbooks',
        items: new Map([
          [MockItem.get("A Beginner's Guide to Charming Snakes"), 1],
          [MockItem.get('Asleep in the Cemetery'), 1],
          [MockItem.get("Benetton's Medley of Diversity"), 1],
          [MockItem.get("Biddy Cracker's Old-Fashioned Cookbook"), 1],
          [MockItem.get('Blizzards I Have Died In'), 1],
          [MockItem.get('Crimbo Candy Cookbook'), 1],
          [MockItem.get("Ellsbury's journal (used)"), 1],
          [MockItem.get("Elron's Explosive Etude"), 1],
          [MockItem.get("Inigo's Incantation of Inspiration"), 1],
          [MockItem.get("Kissin' Cousins"), 1],
          [MockItem.get('Let Me Be!'), 1],
          [MockItem.get('Maxing, Relaxing'), 1],
          [MockItem.get('Prelude of Precision'), 1],
          [MockItem.get('Sensual Massage for Creeps'), 1],
          [MockItem.get("Spellbook: Drescher's Annoying Noise"), 1],
          [MockItem.get('Summer Nights'), 1],
          [MockItem.get('Tales from the Fireside'), 1],
          [MockItem.get('The Art of Slapfighting'), 1],
          [MockItem.get('Travels with Jerry'), 1],
          [MockItem.get('Uncle Romulus'), 1],
          [MockItem.get('Zu Mannkäse Dienen'), 1],
        ]),
      },
    ];

    expect(shelves).toHaveSize(expectedShelves.length);
    expect(shelves).toEqual(expectedShelves);
  });
});
