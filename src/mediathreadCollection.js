/**
 * Functions for managing Mediathread's CollectionWidget.
 *
 * These functions expect jQuery and the CollectionWidget constructor to
 * be available in the global scope. These functions handle DOM
 * insertion and removal for the collection list - I'm working outside
 * of React here.
 */

export function createCollectionWidget(mediaType, caller) {
    jQuery(window).trigger('collection.open', [{
        'media_type': mediaType,
        'disable': mediaType === 'all' ? [] : ['media_type'],
        'caller': caller
    }]);
}

export function editAnnotationWidget(assetId, annotationId, caller) {
    jQuery(window).trigger('collection.annotation.edit', [{
        'caller': caller,
        'assetId': assetId,
        'annotationId': annotationId
    }]);
}
