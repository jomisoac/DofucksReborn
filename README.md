# Dofucks

Educational Task Automation for Dofus Touch. For entertainment purposes only.

**Using this tool may get you banned from the game. I am not responsible for any account that gets banned. You should not use this tool on your main account. Please respect the game and the other players.**

The game itself and all its features are copyrighted to [Ankama](https://www.ankama.com)

# Summary
- [DEMO](#demo)
- [Install & run](#install--run)
- [Want to contribue ?](#want-to-contribute-)
- [To Ankama](#to-ankama)
- [Side note](#side-note)
- [Community](#community)
- [Issues to fix](#issues-to-fix)
- [Features](#features)
  - [Available through UI](#available-through-ui)
    - [Path](#path)
    - [Harvester](#harvester)
    - [XPer](#xper)
    - [Fighter](#fighter)
    - [Deleter](#deleter)
    - [Seller](#seller)
    - [Sitter](#sitter)
    - [Notifications](#notifications)
  - [Available in code](#available-in-code)
    - [AFK Shield](#afk-shield)
    - [Warning Notifications](#warning-notifications)

# DEMO

![Preview](https://puu.sh/xrkrZ/481699ecab.jpg)

[Click here for a video preview](https://puu.sh/xrkpw/d11827d3c3.mp4)

# Install & run

First, we need to install dependencies.
```
npm install
```
Then run the webservice that will allow you to trigger automatic compilation on file change
```
npm run watch
```

Finally, in another terminal, you can now start the game:
```
npm run start
```

# Want to contribute ?

I'd love to !
Keep in mind that is a side project, I make it on my free time and was first developed to improve my automation skills.

# To Ankama

The main goal of this project is to demonstrate and learn how automation can be made using User Interface. No harm to the game was ever intended.
No profits from the game will ever be made.

# Side note

Please don't make an abusive use of this tool.

I'd like it to be as full as possible,
That's why I'm asking you to help me.

Thank you if you contribute. Try to make comments in your PRs and use english for your var names.

Again, thank you. I can't post a Tipeee link or whatever for earning money because this is not my own game, but in case you really want to donate, as a cool developper I am, feel free to contact me @ switooldev@gmail.com

# Community

You can join my discord here : [Discord server](https://discord.gg/e5S8EvV)

# Issues to fix

- [ ] getPath conflict on multi-account (https://puu.sh/xpN7M/478f3929bb.png).
- [ ] Spell casted on dead mob.
- [ ] Character do nothing when the pack of mobs move during the character try to start the fight.

# Features

## Available through UI

### Path

It is a basic feature that allows you to follow a path when using Harvester or XPer. Those features are explained down there.
You must select a path file. It is a json file containing an object, the keys being the names of the path, and the value, an array of string positions. Here is an example:
```javascript
{
  "Kanojedo - fountain": ["0,0","0,1"]
}
```
If you are not on the first map of the path, your character will try, by vectorising its position to the first map position, to go there. It can fail and end in a loop between 2 maps.

The last map of the path should be next to the first one. In my example, it's okay, the character will go right, then left, then right, etc.

You should be aware that if there is the same map two times in the path, the Path module will take the first occurence and see the next map. In other words, your path will not work correctly.

There is no such check when importing a path file, that's an update that should be made.

### Harvester

This module is combined with XPer to make one: *Farmer*.

The Harvester module looks at what you can harvest or collect, and watches the items you want to harvest in the Harvester Options.

When you can harvest something, it will go to the nearest resource and collect it.

If somebody steals the resource and gets it before you, your character will search for another one, or just continue to another map, following the path.

### XPer

This module is combined with Harvester to make one: *Farmer*.

The XPer module looks at the mobs on the map, and if the level is respected, will go attack them.

**This module needs update** to take in account several interesting features:
- A list of mob ID we don't want to be in the group and how many. (Ex: 2 Red Piwis -> it is okay if there is only 1 red piwi in the group but not when there are 2 or more.)
- A list of mob ID we want to be in the group and how many. (Ex: 1 Green Piwi -> not fighting if there are no green piwi in the group.)


### Fighter

This module is quite complicated by its number of lines but actually is very simple.

Berserker mode allow your character to place far away or close to the ennemies at the begin of the fight, and determines if it needs to escape at the end of each turn.

You can choose what spell to allow to be casted by the Fighter by clicking on the spells.

I tried to make the Fighter smart. You can configure timers options to play faster but be careful, if you put too low values, sometimes it will not see your actual AP and MP. The default values are safe.

The Fighter will look first if it can cast any spell on the character cell, but it is temporary. Meaning that when every spell has been tested, it will simulate every other cells on which you can go and will simulate to cast every spell you allowed, and see what is the best.

Each tested spell have a ratio. More the ratio is high, more cool it is to cast that spell.
The ratio is calculated as following (r is ratio):
- each cell traveled removes 0.01r
- boost spell adds 5r (configurable in the code)
- summon spell adds 7r (same)
- killing a mob adds 5r (same)
- touching an ally in the spell effect zone removes 7r (same)
- 100 damage to the mob equals to 1r

The damage is calculated with your power and damage boosts, and also includes the mobs resistance. So if the Fighter detects 100 damage, it will really inflict 100 damage to the mob.

**Warning** some spells are considered as boost, but that you can't cast on you. In that case the spell will not be casted and will bug.

For some other spells, they won't be casted because not considered as boost nor as damage. In this case I need help.

**Needs update**: 
- Not to use every MP when escaping
- Include tackle entirely when moving
- Cast boost or heal spells on allies?

### Deleter

After a fight, when XPer or Harvester is enabled, it will delete the item IDs set.

**Needs update :** a button to "delete items now"

### Seller

When your pods exceeds the limit you've set, the Seller module will start the selling process. It will try to sell by 100 by default the items IDs you've set.

If you tick the toggle ON "Allow sell/10", it will try to sell by 100, but also by 10. If a resource has been sold by 100, it will not try to sell it by 10.

You can be stuck if you have nothing to sell.

The Seller also displays Kamas in bank. But be careful, this value is correct only if you use at 100% time the Dofucks client.

**Needs update :** a button to "sell now"

### Sitter

After a fight, when XPer or Harvester enabled, your character will sit if its health is under the percentage displayed.

### Notifications

You can choose to be notified by some events. Either by sound, by window notification, or both.

## Available in code

### AFK shield

It is very basic and needs to be updated. It sends a ping message to the server (even if you are offline) every 4 or 5 minutes. We should make an UI module and make options for this feature.

At any time your character can be stuck for one or another reason. When the AFK notifications triggers, it kicks the Farmer to continue farming if the character does nothing.

### Warning Notifications

This was made in an hurry. When Administrators or Moderators wants to put you in jail, or you are suspected to be a bot, they send you a popup to alert you. When that popup opens, it should give you a warning.

It also displays a warning notification when you try to update spells or characteristics points in fight, for example.
