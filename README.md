### Scribe

## Scribe wikimedia project

Scribe is an editing tool for underserved language Wikipedias. This tool will allow editors to have a base to start with when translation is not possible. This will allow editors to choose a subject to write about according to their community interests and notability criteria, regardless of the existence of that topic in other Wikipedias. This tool has been conceived to add functionality to the Visual Editor of Mediawiki.

===How to setup===

In order to setup( test ) this tool, follow the steps below:

- Copy the gadget css code to MediaWiki:Gadget-scribe.css on your wiki instance
- Copy the gadget css code to MediaWiki:Gadget-scribe.js on your wiki instance
- Add the following definition code to MediaWiki:Gadgets-definition page on your wiki instance

```
* scribe[ResourceLoader|dependencies=ext.visualEditor.core|mediawiki|mediawiki.api] | scribe.js|scribe.css
* scribe
core[ResourceLoader|dependencies=ext.visualEditor.core|mediawiki|mediawiki.api]|scribe.js|scribe.css

```

You can now test the tool when iusing Visual Editor to edit a Wiki
