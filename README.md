# Dofucks

**Using this tool may get you banned from the game. I am not responsible for any account that gets banned. You should not use this tool on your main account. Please respect the game and the other players.**

This tool provides access to the official client but **no single source is hosted here**

# Summary
- [DEMO](#demo)
- [Install & run](#install--run)
- [Side note](#side-note)
- [Community](#community)
- [Architecture](#architecture)


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

# Side note

I've developped this tool for a year on my free time. I spent a lot on this.
If you want to contribute, you can send a donation to this bitcoin address: **1Jrmsik9L7SCqgvfTvH5V3v2ePdmGFoCxw** or clone this repo to make it better ;)

# Community

You can join my discord here : [Discord server](https://discord.gg/e5S8EvV)

# Architecture

```
├── Dofucks
│   ├── src
│   │   ├── assets                      # Assets used from other folders, like images
│   │   ├── browser                     # Public path for the loaded page in electron
│   │   │   ├── build                   # Builds are stored here (bundle.js)
│   │   │   ├── sounds                  # Sounds used for notifications
│   │   ├── client                      # Source of the bot, built in src/browser/build/bundle.js
│   │   │   ├── app                     # Contains tabs and windows logic
│   │   │   │   ├── Analytics.js        # Very experimental, not used at all.
│   │   │   │   ├── App.js              # Tabs logic and renderer.
│   │   │   │   ├── Game.js             # Renders iframe which leads to the game.
│   │   │   ├── bot                     # Contains the bot features
│   │   │   │   ├── db                  # Exports from DT databases Used by the bot
│   │   │   │   ├── modules             # Every Module is a part of a Widget. Written with React
│   │   │   │   ├── util                # Utils are the core of the logic. No UI in there
│   │   │   │   ├── widgets             # Widgets written with React, they are just containers that include modules.
│   │   │   │   ├── Bot.js              # This is rendered by App.js, this is the main file. It is a container for all the Widgets.
│   │   │   │   ├── Module.js           # Every Module should extend this file. #### Need more documentation in here, explaining tag, setValue and setOptionValue
│   │   │   │   ├── Notification.js     # Every notification in the UI should extend this file. Notifications do not have an "util" associated to them
│   │   │   │   ├── Options.js          # This file contains options, for example notification options.
│   │   │   ├── Dofucks.js              # Entry point of the Bot, this is the main file
│   │   │   ├── dofucks.less
│   │   │   ├── variables.less          # Experimental, but "works"
│   │   ├── electron                    # Electron logic (Auto update, ...)
├── create_asar.sh                      # Do not run on windows (unless you have git bash) - used to create asar file, for production
├── gruntfile.js                        # Create windows installer configuration
├── main.js                             # Entry point of electron
├── make_new_version.sh                 # It helps me to upload a new version only by calling this file, do not use/touch/execute
├── pack_n_sign.sh                      # Shortcut to sign the Mac app
├── package.json
├── paths.json
├── webpack.common.js                   # Used for both prod and dev
├── webpack.dev.js
├── webpack.prod.js
```
