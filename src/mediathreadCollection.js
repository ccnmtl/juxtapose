/**
 * Functions for managing Mediathread's CollectionWidget.
 *
 * These functions expect jQuery and the CollectionWidget constructor to
 * be available in the global scope. These functions handle DOM
 * insertion and removal for the collection list - I'm working outside
 * of React here.
 */

export function createCollectionWidget(mediaType) {
    jQuery('#container').prepend(
        jQuery('<div class="jux-collection">' +
               '<div class="jux-collection-table"></div>' +
               '<div class="jux-collection-popup"></div>' +
               '</div>'));

    new CollectionWidget({
        '$el': jQuery('.jux-collection'),
        'template': 'collection',
        'mediaType': mediaType,
        'template_label': 'jux-collection-table'
    });
}
