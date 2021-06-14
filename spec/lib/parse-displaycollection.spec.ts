import mock from 'mock-require';
import {xpath} from 'kolmafia-stubs';

import {descToItem, Item, ITEM_NONE, JavaException} from './item';

//-------- Inject mock objects and methods

mock('kolmafia', {
  descToItem,
  getRevision: () => 20590,
  print(str: string): void {
    console.log(str);
  },
  toItem(name: string): Item {
    try {
      return Item.get(name);
    } catch (e) {
      if (e instanceof JavaException) {
        return ITEM_NONE;
      }
      throw e;
    }
  },
  xpath,
});

(
  global as typeof global & {
    JavaException: typeof JavaException;
  }
).JavaException = JavaException;

(global as typeof global & {Item: typeof Item}).Item = Item;

import {parseShelves} from '../../src/lib/parse-displaycollection';

const shelf0Table =
  '<table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href=\'javascript:toggle("shelf0");\' class=nounder><font color=white>Display Case</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id=\'shelf0\'><table>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick=\'descitem(908927941,1234567890)\'></td><td valign=center><b>Book of Old-Timey Carols</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/beardgrin.gif" class=hand onClick=\'descitem(485610584,1234567890)\'></td><td valign=center><b>Crimbo smile</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/carddeck.gif" class=hand onClick=\'descitem(750777542,1234567890)\'></td><td valign=center><b>deck of tropical cards</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/eggballoon.gif" class=hand onClick=\'descitem(787370659,1234567890)\'></td><td valign=center><b>easter egg balloon</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/lewdcard.gif" class=hand onClick=\'descitem(683821625,1234567890)\'></td><td valign=center><b>lewd playing card</b> (3)</td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/wrapping.gif" class=hand onClick=\'descitem(668178244,1234567890)\'></td><td valign=center><b>mummy costume</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/eggballoon.gif" class=hand onClick=\'descitem(975224635,1234567890)\'></td><td valign=center><b>oyster egg balloon</b></td></tr>' +
  '</table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table>';
const shelf1Table =
  '<table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href=\'javascript:toggle("shelf1");\' class=nounder><font color=white>Items with nonstandard names</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id=\'shelf1\'><table>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/potion9.gif" class=hand onClick=\'descitem(863678027,1234567890)\'></td><td valign=center><b>Love Potion #XYZ</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/spandex.gif" class=hand onClick=\'descitem(259836862,1234567890)\'></td><td valign=center><b>spandex anniversary shorts</b></td></tr>' +
  '</table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table>';
const shelf2Table =
  '<table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href=\'javascript:toggle("shelf2");\' class=nounder><font color=white>Unexpected Gifts</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id=\'shelf2\'><table>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/chromebox.gif" class=hand onClick=\'descitem(151059179,1234567890)\'></td><td valign=center><b>box of sunshine</b> (4)</td></tr>' +
  '</table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table>';
const shelf3Table =
  '<table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href=\'javascript:toggle("shelf3");\' class=nounder><font color=white>Dungeoneer\'s Dump</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id=\'shelf3\'><table>' +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/styore.gif\" class=hand onClick='descitem(380631575,1234567890)'></td><td valign=center><b>Frosty's iceball</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/varcolacpaw.gif\" class=hand onClick='descitem(307397478,1234567890)'></td><td valign=center><b>Hodgman's varcolac paw</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/handcan.gif\" class=hand onClick='descitem(878278248,1234567890)'></td><td valign=center><b>Ol' Scratch's ash can</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/trashield.gif\" class=hand onClick='descitem(203629025,1234567890)'></td><td valign=center><b>Oscus's garbage can lid</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/zomboeye.gif\" class=hand onClick='descitem(166850527,1234567890)'></td><td valign=center><b>Zombo's empty eye</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/bonepants.gif\" class=hand onClick='descitem(587267531,1234567890)'></td><td valign=center><b>Zombo's grievous greaves</b></td></tr>" +
  '</table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table>';
const shelf4Table =
  '<table  width=400  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b><a href=\'javascript:toggle("shelf4");\' class=nounder><font color=white>Skillbooks</font></a></b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><span id=\'shelf4\'><table>' +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif\" class=hand onClick='descitem(245745289,1234567890)'></td><td valign=center><b>A Beginner's Guide to Charming Snakes</b></td></tr>" +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(801300658,1234567890)\'></td><td valign=center><b>Asleep in the Cemetery</b></td></tr>' +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif\" class=hand onClick='descitem(258185206,1234567890)'></td><td valign=center><b>Benetton's Medley of Diversity</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif\" class=hand onClick='descitem(136121854,1234567890)'></td><td valign=center><b>Biddy Cracker's Old-Fashioned Cookbook</b></td></tr>" +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(374672848,1234567890)\'></td><td valign=center><b>Blizzards I Have Died In</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif" class=hand onClick=\'descitem(294757522,1234567890)\'></td><td valign=center><b>Crimbo Candy Cookbook</b></td></tr>' +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif\" class=hand onClick='descitem(715682439,1234567890)'></td><td valign=center><b>Ellsbury's journal (used)</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif\" class=hand onClick='descitem(220021939,1234567890)'></td><td valign=center><b>Elron's Explosive Etude</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif\" class=hand onClick='descitem(629749615,1234567890)'></td><td valign=center><b>Inigo's Incantation of Inspiration</b></td></tr>" +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif\" class=hand onClick='descitem(831722443,1234567890)'></td><td valign=center><b>Kissin' Cousins</b></td></tr>" +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(183602575,1234567890)\'></td><td valign=center><b>Let Me Be!</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(664515385,1234567890)\'></td><td valign=center><b>Maxing, Relaxing</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/music.gif" class=hand onClick=\'descitem(243581726,1234567890)\'></td><td valign=center><b>Prelude of Precision</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(543030767,1234567890)\'></td><td valign=center><b>Sensual Massage for Creeps</b></td></tr>' +
  "<tr><td width=30 height=30><img src=\"https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif\" class=hand onClick='descitem(198964664,1234567890)'></td><td valign=center><b>Spellbook: Drescher's Annoying Noise</b></td></tr>" +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(682348153,1234567890)\'></td><td valign=center><b>Summer Nights</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(186707798,1234567890)\'></td><td valign=center><b>Tales from the Fireside</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(949615276,1234567890)\'></td><td valign=center><b>The Art of Slapfighting</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(499215664,1234567890)\'></td><td valign=center><b>Travels with Jerry</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(478200390,1234567890)\'></td><td valign=center><b>Uncle Romulus</b></td></tr>' +
  '<tr><td width=30 height=30><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book4.gif" class=hand onClick=\'descitem(398556198,1234567890)\'></td><td valign=center><b>Zu Mannk&auml;se Dienen</b></td></tr>' +
  '</table></span></td></tr></table></center></td></tr><tr><td height=4></td></tr></table>';

/**
 * Generates test input HTML
 * @param displayCaseMessage HTML for the user-supplied display case message
 * @param shelfTable HTML snippet for each shelf <table></table>
 */
function generateInputHtml(
  displayCaseMessage: string,
  shelfTables: string
): string {
  // Notes about the input HTML:
  //
  // - Player name replaced with "Player Name"
  // - Player ID replaced with 1234567890
  return (
    `<html><head>
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
<div id='menu' class=rcm></div><centeR><table  width=95%  cellspacing=0 cellpadding=0><tr><td style="color: white;" align=center bgcolor=blue><b>Display Case (<a style='color: white; text-decoration: none;' href="showplayer.php?who=1234567890">Player Name</a>)</b></td></tr><tr><td style="padding: 5px; border: 1px solid blue;"><center><table><tr><td><table><tr><td valign=center><img src="https://s3.amazonaws.com/images.kingdomofloathing.com/otherimages/museum/displaycase.gif" width=100 height=100></td><td valign=center>` +
    displayCaseMessage +
    '</td></tr></table><p><center>' +
    shelfTables +
    '</center><p><center><a href="managecollection.php">Manage your Display Case</a></center><p><center><a href="museum.php?place=collections">Back to The Museum</a></center></td></tr></table></center></td></tr><tr><td height=4></td></tr></table></center></body><script src="/onfocus.1.js"></script></html>'
  );
}

describe('displaycollection', () => {
  describe('parseShelves()', () => {
    it('should parse shelves correctly', () => {
      const shelves = parseShelves(
        generateInputHtml(
          'This is the display case message',
          shelf0Table + shelf1Table + shelf2Table + shelf3Table + shelf4Table
        )
      );

      const expectedShelves = [
        {
          name: 'Display Case',
          playerId: '1234567890',
          items: new Map([
            [
              Item.get('Book of Old-Timey Carols'),
              {amount: 1, displayCaseName: 'Book of Old-Timey Carols'},
            ],
            [
              Item.get('Crimbo smile'),
              {amount: 1, displayCaseName: 'Crimbo smile'},
            ],
            [
              Item.get('deck of tropical cards'),
              {amount: 1, displayCaseName: 'deck of tropical cards'},
            ],
            [
              Item.get('easter egg balloon'),
              {amount: 1, displayCaseName: 'easter egg balloon'},
            ],
            [
              Item.get('lewd playing card'),
              {amount: 3, displayCaseName: 'lewd playing card'},
            ],
            [
              Item.get('mummy costume'),
              {amount: 1, displayCaseName: 'mummy costume'},
            ],
            [
              Item.get('oyster egg balloon'),
              {amount: 1, displayCaseName: 'oyster egg balloon'},
            ],
          ]),
        },
        {
          name: 'Items with nonstandard names',
          playerId: '1234567890',
          items: new Map([
            [
              Item.get('Love Potion #0'),
              {amount: 1, displayCaseName: 'Love Potion #XYZ'},
            ],
            [
              Item.get('spandex anniversary shorts'),
              {amount: 1, displayCaseName: 'spandex anniversary shorts'},
            ],
          ]),
        },
        {
          name: 'Unexpected Gifts',
          playerId: '1234567890',
          items: new Map([
            [
              Item.get('box of sunshine'),
              {amount: 4, displayCaseName: 'box of sunshine'},
            ],
          ]),
        },
        {
          name: "Dungeoneer's Dump",
          playerId: '1234567890',
          items: new Map([
            [
              Item.get("Frosty's iceball"),
              {amount: 1, displayCaseName: "Frosty's iceball"},
            ],
            [
              Item.get("Hodgman's varcolac paw"),
              {amount: 1, displayCaseName: "Hodgman's varcolac paw"},
            ],
            [
              Item.get("Ol' Scratch's ash can"),
              {amount: 1, displayCaseName: "Ol' Scratch's ash can"},
            ],
            [
              Item.get("Oscus's garbage can lid"),
              {amount: 1, displayCaseName: "Oscus's garbage can lid"},
            ],
            [
              Item.get("Zombo's empty eye"),
              {amount: 1, displayCaseName: "Zombo's empty eye"},
            ],
            [
              Item.get("Zombo's grievous greaves"),
              {amount: 1, displayCaseName: "Zombo's grievous greaves"},
            ],
          ]),
        },
        {
          name: 'Skillbooks',
          playerId: '1234567890',
          items: new Map([
            [
              Item.get("A Beginner's Guide to Charming Snakes"),
              {
                amount: 1,
                displayCaseName: "A Beginner's Guide to Charming Snakes",
              },
            ],
            [
              Item.get('Asleep in the Cemetery'),
              {amount: 1, displayCaseName: 'Asleep in the Cemetery'},
            ],
            [
              Item.get("Benetton's Medley of Diversity"),
              {amount: 1, displayCaseName: "Benetton's Medley of Diversity"},
            ],
            [
              Item.get("Biddy Cracker's Old-Fashioned Cookbook"),
              {
                amount: 1,
                displayCaseName: "Biddy Cracker's Old-Fashioned Cookbook",
              },
            ],
            [
              Item.get('Blizzards I Have Died In'),
              {amount: 1, displayCaseName: 'Blizzards I Have Died In'},
            ],
            [
              Item.get('Crimbo Candy Cookbook'),
              {amount: 1, displayCaseName: 'Crimbo Candy Cookbook'},
            ],
            [
              Item.get("Ellsbury's journal (used)"),
              {amount: 1, displayCaseName: "Ellsbury's journal (used)"},
            ],
            [
              Item.get("Elron's Explosive Etude"),
              {amount: 1, displayCaseName: "Elron's Explosive Etude"},
            ],
            [
              Item.get("Inigo's Incantation of Inspiration"),
              {
                amount: 1,
                displayCaseName: "Inigo's Incantation of Inspiration",
              },
            ],
            [
              Item.get("Kissin' Cousins"),
              {amount: 1, displayCaseName: "Kissin' Cousins"},
            ],
            [
              Item.get('Let Me Be!'),
              {amount: 1, displayCaseName: 'Let Me Be!'},
            ],
            [
              Item.get('Maxing, Relaxing'),
              {amount: 1, displayCaseName: 'Maxing, Relaxing'},
            ],
            [
              Item.get('Prelude of Precision'),
              {amount: 1, displayCaseName: 'Prelude of Precision'},
            ],
            [
              Item.get('Sensual Massage for Creeps'),
              {amount: 1, displayCaseName: 'Sensual Massage for Creeps'},
            ],
            [
              Item.get("Spellbook: Drescher's Annoying Noise"),
              {
                amount: 1,
                displayCaseName: "Spellbook: Drescher's Annoying Noise",
              },
            ],
            [
              Item.get('Summer Nights'),
              {amount: 1, displayCaseName: 'Summer Nights'},
            ],
            [
              Item.get('Tales from the Fireside'),
              {amount: 1, displayCaseName: 'Tales from the Fireside'},
            ],
            [
              Item.get('The Art of Slapfighting'),
              {amount: 1, displayCaseName: 'The Art of Slapfighting'},
            ],
            [
              Item.get('Travels with Jerry'),
              {amount: 1, displayCaseName: 'Travels with Jerry'},
            ],
            [
              Item.get('Uncle Romulus'),
              {amount: 1, displayCaseName: 'Uncle Romulus'},
            ],
            [
              Item.get('Zu Mannkäse Dienen'),
              {amount: 1, displayCaseName: 'Zu Mannkäse Dienen'},
            ],
          ]),
        },
      ];

      expect(shelves).toHaveSize(expectedShelves.length);
      expect(shelves).toEqual(expectedShelves);
    });

    it('should correctly handle display case messages with links', () => {
      const shelves = parseShelves(
        generateInputHtml(
          'Display case message with links<br><br>A link on next line<br>www.google.com<br><a target=_blank href="http://www.example.com/"><font color=blue>[link]</font></a> http:// www.example.com/<br>more links: <a target=_blank href="https://www.kingdomofloathing.com/"><font color=blue>[link]</font></a> https:// www.kingdomofloathin g.com/<br>end of links',
          shelf0Table
        )
      );

      const expectedShelves = [
        {
          name: 'Display Case',
          playerId: '1234567890',
          items: new Map([
            [
              Item.get('Book of Old-Timey Carols'),
              {amount: 1, displayCaseName: 'Book of Old-Timey Carols'},
            ],
            [
              Item.get('Crimbo smile'),
              {amount: 1, displayCaseName: 'Crimbo smile'},
            ],
            [
              Item.get('deck of tropical cards'),
              {amount: 1, displayCaseName: 'deck of tropical cards'},
            ],
            [
              Item.get('easter egg balloon'),
              {amount: 1, displayCaseName: 'easter egg balloon'},
            ],
            [
              Item.get('lewd playing card'),
              {amount: 3, displayCaseName: 'lewd playing card'},
            ],
            [
              Item.get('mummy costume'),
              {amount: 1, displayCaseName: 'mummy costume'},
            ],
            [
              Item.get('oyster egg balloon'),
              {amount: 1, displayCaseName: 'oyster egg balloon'},
            ],
          ]),
        },
      ];

      expect(shelves).toHaveSize(expectedShelves.length);
      expect(shelves).toEqual(expectedShelves);
    });
  });
});
