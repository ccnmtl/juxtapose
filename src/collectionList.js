/**
 * Functions for managing Mediathread's CollectionList.
 *
 * These functions expect jQuery and the CollectionList constructor to
 * be available in the global scope. These functions handle DOM
 * insertion and removal for the collection list - I'm working outside
 * of React here.
 */

export function createCollectionList() {
    jQuery('#container').prepend(
        jQuery('<div class="jux-collection">' +
               '<div class="jux-collection-table"></div>' +
               '<div class="jux-collection-popup"></div>' +
               '</div>'));

    new CollectionList({
        '$parent': jQuery('.jux-collection'),
        'template': 'collection',
        'template_label': 'jux-collection-table',
        'view_callback': function(assetCount) {
            // TODO
        }
    });
}
