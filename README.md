# Better-Tumblr-Video
Replaces Tumblr's video player (that lacks volume control) with the Plyr (https://plyr.io/) video player (with volume control).

Caveats: Doesn't work on all pages. Some pages of tumblr, like the search page and certain user pages (depends on theme), are completely ensconced in an iframe, which prevents the extension from seeing any videos on the page.

Needs permissions:
Storage - to store your preferred default video volume.
GETS to www.tumblr.com domain - to get video urls. Cant get from page because they are in an iframe.
