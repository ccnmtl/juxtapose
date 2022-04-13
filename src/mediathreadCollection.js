/* global jQuery */

/**
 * Functions for managing Mediathread's CollectionWidget.
 *
 * These functions expect jQuery and the CollectionWidget constructor to
 * be available in the global scope. These functions handle DOM
 * insertion and removal for the collection list - I'm working outside
 * of React here.
 */

export function createCollectionWidget(mediaType, allowAssets, caller) {
    jQuery(window).trigger('collection.open', [{
        'allowAssets': allowAssets,
        'media_type': mediaType,

        // EXCLUDE pdf type
        'primary_type': ['pdf'],

        'disable': mediaType === 'all' ? [] : ['media_type'],
        'caller': caller
    }]);
}

export function editAnnotationWidget(assetId, annotationId,
                                     isGlobalAnnotation, caller) {
    const eventName = isGlobalAnnotation ?
        'collection.annotation.create' : 'collection.annotation.edit';
    jQuery(window).trigger(eventName, [{
        'caller': caller,
        'assetId': assetId,
        'annotationId': annotationId
    }]);
}
