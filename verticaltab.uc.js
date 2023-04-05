/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ==UserScript==
// @name            Firefox vertical tabs
// @include         main
// @author          Surapunoyousei
// @LICENSE         MPL-2.0 | MrOtherGuy's CSS Hacks(window_control_placeholder_support.css)(tabs_on_bottom.css)
// @NOTE            This script is based on Floorp's JavaScript code. If you want to use the original code, please use the following link.
// ==/UserScript==

/* How to use this script */
// 0. Use Firefox ESR, Developer Edition, or Nightly.
// 1. Install this script use "userChromeJS".
// 2. change pref "xpinstall.signatures.required" to "false" & "extensions.experiments.enabled" to "true" on "about:config"
// 3. Install "Paxmod" from "https://github.com/numirias/paxmod/releases/latest"
// 4. Restart Firefox.
// 5. Finally, you can use vertical tabs!

// original: https://github.com/Floorp-Projects/Floorp-Nightly/blob/master/floorp/browser/base/content/browser-verticaltabs.js
// original: https://github.com/surapunoyousei/userChromeJS/blob/main/verticaltab.uc.js
// repository: https://github.com/surapunoyousei/userChromeJS


window.setTimeout(function () {
  document.getElementsByClassName("toolbar-items")[0].id = "toolbar-items-verticaltabs";
  let verticalTabs = document.getElementById("toolbar-items-verticaltabs");
  let sidebarBox = document.getElementById("sidebar-box");
  //init sidebar
  sidebarBox.setAttribute("style", "overflow: scroll !important;");
  //init vertical tabs
  sidebarBox.insertBefore(verticalTabs, sidebarBox.firstChild);
  let tabBrowserArrowScrollBox = document.getElementById("tabbrowser-arrowscrollbox");
  verticalTabs.setAttribute("align", "start");
  tabBrowserArrowScrollBox.setAttribute("orient", "vertical");
  tabBrowserArrowScrollBox.removeAttribute("overflowing");
  tabBrowserArrowScrollBox.removeAttribute("scrolledtostart")
  tabBrowserArrowScrollBox.disabled = true;
  document.getElementById("tabbrowser-tabs").setAttribute("orient", "vertical");
  tabBrowserArrowScrollBox.shadowRoot.querySelector(`[part="scrollbox"]`).setAttribute("orient", "vertical");
  //Delete max-height
  let observer = new MutationObserver(function () {
    tabBrowserArrowScrollBox.shadowRoot.querySelector(`[part="scrollbox"]`).removeAttribute("style");
  })
  observer.observe(tabBrowserArrowScrollBox.shadowRoot.querySelector(`[part="scrollbox"]`), {
    attributes: true
  });
  //move menubar
  document.getElementById("titlebar").before(document.getElementById("toolbar-menubar"));
  if (sidebarBox.getAttribute("hidden") == "true") {
    SidebarUI.toggle();
  }
  let promise = new Promise(function (resolve, reject) {
    SidebarUI.toggle() ? resolve() : reject();
  });
  promise.then(function () {
    SidebarUI.toggle();
  });
}, 500);
//toolbar modification
let Tag = document.createElement("style");
Tag.textContent = `
/* Source file https://github.com/MrOtherGuy/firefox-csshacks/tree/master/chrome/tabs_on_bottom.css made available under Mozilla Public License v. 2.0
See the above repository for updates as well as full license text. */


:root{ --uc-titlebar-padding: 0px; }
@media  (-moz-platform: windows),
        (-moz-platform: windows-win7),
        (-moz-platform: windows-win10){
  :root[sizemode="maximized"][tabsintitlebar]{
    --uc-titlebar-padding: 8px;
  }
}
#toolbar-menubar[autohide="true"] > .titlebar-buttonbox-container,
#TabsToolbar > .titlebar-buttonbox-container{
  position: fixed;
  display: block;
  top: 0;
  right:0;
  height: 40px;
}
/* Mac specific. You should set that font-smoothing pref to true if you are on any platform where window controls are on left */
@supports -moz-bool-pref("layout.css.osx-font-smoothing.enabled"){
  :root{ --uc-titlebar-padding: 0px !important }
  .titlebar-buttonbox-container{ left:0; right: unset !important; }
}

:root[uidensity="compact"] #TabsToolbar > .titlebar-buttonbox-container{ height: 32px }

#toolbar-menubar[inactive] > .titlebar-buttonbox-container{ opacity: 0 }

#navigator-toolbox{ padding-top: var(--uc-titlebar-padding,0px) !important; }

.titlebar-buttonbox-container > .titlebar-buttonbox{ height: 100%; }

#titlebar{
  -moz-box-ordinal-group: 2;
  -moz-appearance: none !important;
  --tabs-navbar-shadow-size: 0px;
}
/* Re-order window and tab notification boxes */
#navigator-toolbox > div{ display: contents }
.global-notificationbox,
#tab-notification-deck{ -moz-box-ordinal-group: 2 }

#TabsToolbar .titlebar-spacer{ display: none; }
/* Also hide the toolbox bottom border which isn't at bottom with this setup */
#navigator-toolbox::after{ display: none !important; }

@media (-moz-gtk-csd-close-button){ .titlebar-button{ -moz-box-orient: vertical } }

/* At Activated Menubar */
:root:not([chromehidden~="menubar"], [sizemode="fullscreen"]) #toolbar-menubar:not([autohide="true"]) + #TabsToolbar > .titlebar-buttonbox-container {
  display: block !important;
}
#toolbar-menubar:not([autohide="true"]) > .titlebar-buttonbox-container {
  visibility: hidden;
}

/* These exist only for compatibility with autohide-tabstoolbar.css */
toolbox#navigator-toolbox > toolbar#nav-bar.browser-toolbar{ animation: none; }
#navigator-toolbox:hover #TabsToolbar{ animation: slidein ease-out 48ms 1 }
#TabsToolbar > .titlebar-buttonbox-container{ visibility: visible }
#navigator-toolbox:not(:-moz-lwtheme){ background-color: -moz-dialog }

/* Uncomment the following if you want bookmarks toolbar to be below tabs */
/*
#PersonalToolbar{ -moz-box-ordinal-group: 2 }
*/

/* Source file https://github.com/MrOtherGuy/firefox-csshacks/tree/master/chrome/window_control_placeholder_support.css made available under Mozilla Public License v. 2.0
See the above repository for updates as well as full license text. */

/* Creates placeholders for window controls */
/* This is a supporting file used by other stylesheets */

/* This stylesheet is pretty much unnecessary if window titlebar is enabled */

/* This file should preferably be imported before other stylesheets */

/* Defaults for window controls on RIGHT side of the window */
/* Modify these values to match your preferences */
:root:is([tabsintitlebar], [sizemode="fullscreen"]) {
    --uc-window-control-width: 138px; /* Space reserved for window controls (Win10) */
    /* Extra space reserved on both sides of the nav-bar to be able to drag the window */
    --uc-window-drag-space-pre: 30px; /* left side*/
    --uc-window-drag-space-post: 30px; /* right side*/
  }
  
  :root:is([tabsintitlebar][sizemode="maximized"], [sizemode="fullscreen"]) {
    --uc-window-drag-space-pre: 0px; /* Remove pre space */
  }
  
  @media  (-moz-platform: windows-win7),
          (-moz-platform: windows-win8),
          (-moz-os-version: windows-win7),
          (-moz-os-version: windows-win8){
    :root:is([tabsintitlebar], [sizemode="fullscreen"]) {
      --uc-window-control-width: 105px;
    }
  }
  
  @media (-moz-gtk-csd-available) {
    :root:is([tabsintitlebar],[sizemode="fullscreen"]) {
      --uc-window-control-width: 84px;
    }
  }
  
  /* macOS settings are further below */
  .titlebar-buttonbox, #window-controls{ color: var(--toolbar-color) }
  :root[sizemode="fullscreen"] .titlebar-buttonbox-container{ display: none }
  :root[sizemode="fullscreen"] #navigator-toolbox { position: relative; }
  
  :root[sizemode="fullscreen"] #TabsToolbar > .titlebar-buttonbox-container:last-child,
  :root[sizemode="fullscreen"] #window-controls{
    position: absolute;
    display: flex;
    top: 0;
    right:0;
    height: 40px;
    visibility: hidden !important;
  }
  
  :root[sizemode="fullscreen"] #TabsToolbar > .titlebar-buttonbox-container:last-child,
  :root[uidensity="compact"][sizemode="fullscreen"] #window-controls{ height: 32px }
  
  #nav-bar{
    border-inline: var(--uc-window-drag-space-pre,0px) solid var(--toolbar-bgcolor);
    border-inline-style: solid !important;
    border-right-width: calc(var(--uc-window-control-width,0px) + var(--uc-window-drag-space-post,0px));
  }
  
  /* Use this pref to check Mac OS where window controls are on left */
  /* This pref defaults to true on Mac and doesn't actually do anything on other platforms. So if your system has window controls on LEFT side you can set the pref to true */
  @supports -moz-bool-pref("layout.css.osx-font-smoothing.enabled"){
    :root:is([tabsintitlebar], [sizemode="fullscreen"]) {
      --uc-window-control-width: 72px;
    }
    :root[tabsintitlebar="true"]:not([inFullscreen]) #nav-bar{
      border-inline-width: calc(var(--uc-window-control-width,0px) + var(--uc-window-drag-space-post,0px)) var(--uc-window-drag-space-pre,0px)
    }
    :root[sizemode="fullscreen"] #TabsToolbar > .titlebar-buttonbox-container:last-child,
    :root[sizemode="fullscreen"] #window-controls{ right: unset }
    
    .titlebar-buttonbox-container{
      position: fixed;
      top: 10px !important;
    }
  }

  #navigator-toolbox{
    padding: 0 !important;
  }
  .titlebar-buttonbox-container{
    position: fixed;
    top: 0px;
  }


/*-- This Source Code Form is subject to the terms of the Mozilla Public
- License, v. 2.0. If a copy of the MPL was not distributed with this
- file, You can obtain one at http://mozilla.org/MPL/2.0/. */

@import url("chrome://browser/skin/tabbar/verticaltab.css");

   #titlebar{
    height: 0px !important;
    min-height: 0px !important;
    max-height: 0px !important;
  }

  .private-browsing-indicator{
    display: none !important;
  }

  #tabs-newtab-button, #new-tab-button, #alltabs-button {
    display: none;
  }

.tabbrowser-tab {
 display: block !important;
}

#TabsToolbar-customization-target {
width: -moz-available !important;
min-width: -moz-available !important;;
max-width: -moz-available !important;
height: 100% !important;
background: var(--lwt-accent-color);
}

#toolbar-items-verticaltabs {
-moz-box-ordinal-group: 0 !important;
width: -moz-available;
display: block; 
overflow-y: scroll;
overflow-x: hidden;
scrollbar-width: none;
min-height: 0px;
}

/* Hide tabtoolber custom elem */
#main-window[tabsintitlebar="true"]:not([extradragspace="true"]) #TabsToolbar > .toolbar-items {
display: none !important;
}

#sidebar-box {
max-width: 50em !important;
min-width: 3em !important;
}

#tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]) > #tabbrowser-arrowscrollbox > .tabbrowser-tab[first-visible-unpinned-tab] {
margin-inline-start: 0 !important
}

#tabbrowser-tabs[overflow] .tabbrowser-tab[last-visible-tab]:not([pinned], [style*="max-width"])[fadein] {
margin-inline-end: 0 !important
}

#tabbrowser-tabs {
max-width: -moz-available !important;
min-width: -moz-available !important;
width: auto;
}

#TabsToolbar-customization-target > .toolbarbutton-1 {
display: none !important;
}

.tab-icon-image:not([pinned]) {
padding-inline-end: 1px;
}
.tabbrowser-tab:not([pinned]):not([fadein]) {
display: none !important;
max-width: 0 !important;
min-width: 0 !important;
width: 0 !important;
max-height: 0 !important;
min-height: 0 !important;
height: 0 !important;
}

.tabbrowser-tab.tabbrowser-tab:not([pinned]){
width: -moz-available !important;
min-width: -moz-available !important;
max-width: -moz-available !important;
padding-inline-start: 5px !important;
padding-inline-end: 5px !important;
}

#tabbrowser-tabs[positionpinnedtabs] > #tabbrowser-arrowscrollbox > .tabbrowser-tab[pinned] {
position: unset !important;
}

:root:not([uidensity="touch"]) #tabbrowser-arrowscrollbox {
--scrollbtn-inner-padding: 0px;
--scrollbtn-outer-padding: 0px;
}

#tabbrowser-tabs[positionpinnedtabs] > #tabbrowser-arrowscrollbox::part(scrollbox) {
padding-inline: 0 !important;
}

#tabs-newtab-button {
display: block !important;
width: -moz-available;
}

#tabbrowser-arrowscrollbox-periphery{
width: -moz-available !important;
min-width: -moz-available !important;
max-width: -moz-available !important;
}

#alltabs-button, #new-tab-button {
display: none !important;
}

#tabs-newtab-button > .toolbarbutton-text {
display: none ;
}

.tabbrowser-tab {
width: -moz-available !important;
min-width: -moz-available !important;
max-width: -moz-available !important;
}

.tabbrowser-tab[pinned] {
position: unset !important;
max-width: 3em !important;
width: 3em !important;
min-width: 3em !important;
}

.tab-label-container[pinned] {
display: none !important;
}

#tabbrowser-arrowscrollbox {
display: block;
}

/* disable Firefox's sidebar features */

#sidebar-header {
 display: none !important;
}

#sidebar {
 display: none !important;
}

#sidebar-button {
 display: none !important;
}

/* UI size */
:root[uidensity=touch]  .tabbrowser-tab[pinned] {
 max-width: 3.2em !important;
 width: 3.2em !important;
 min-width: 3.2em !important;
}

:root[uidensity=compact]  .tabbrowser-tab[pinned] {
 max-width: 2.5em !important;
 width: 2.5em !important;
 min-width: 2.5em !important;
}

#vertical-tab-reverse-position {
list-style-image: url("chrome://browser/skin/sort.svg");
}

`;
document.head.appendChild(Tag);
Services.prefs.addObserver("floorp.browser.native.verticaltabs.enabled", function () {
  if ("floorp.browser.native.verticaltabs.enabled") {
    Services.prefs.setBoolPref("floorp.enable.multitab", false);
  }
}, false);
/**************************************** vertical tab change position ****************************************/
(async() => {
  CustomizableUI.createWidget({
    id: "vertical-tab-reverse-position",
    type: "button",
    label: "reverse Verticaltab Position",
    tooltiptext: "reverse Verticaltab Position",
    onCreated(aNode) {
      aNode.appendChild(window.MozXULElement.parseXULToFragment(`<stack xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" class="toolbarbutton-badge-stack"><image class="toolbarbutton-icon" label="閉じたタブを開く"/><html:label xmlns:html="http://www.w3.org/1999/xhtml" class="toolbarbutton-badge" ></html:label></stack>`))
      let a = aNode.querySelector(".toolbarbutton-icon:not(stack > .toolbarbutton-icon)")
      if (a != null) a.remove()
    },
    onCommand() {
      SidebarUI.reversePosition();
    }
  });
  CustomizableUI.addWidgetToArea("vertical-tab-reverse-position", CustomizableUI.AREA_NAVBAR, 1);
})();