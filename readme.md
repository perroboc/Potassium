Potassium
=========

This is a web extension that adds some features to Kindle Cloud Reader.

Install
-------

[![](assets/browser-chrome.svg) Get it from Google Chrome web store](https://chrome.google.com/webstore/detail/potassium-kindle-enhancer/kbmedoagfgahgaeodiahdhhnkcchlign)

[![](assets/browser-edge.svg) Get it from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/potassium-kindle-enhance/lnjihjdgpfmdgckfjfjohldlcgohkjaa)

[![](assets/browser-firefox.svg) Get it from Mozilla Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/potassium-kindle-enhancer/)

<!-- ![](assets/browser-safari.svg) -->

Features
--------

Library:
- Hide books in library view

Manga/comics
- Change reading direction
- Adjust brightness
- Adjust contrast

Build
-----

You need `npm`:
```shell
npm install
gulp
```

The zip files are located in the dist folder. Mozilla uses v2 manifest, while chromium browsers use v3.

TODO: live reload while developing.