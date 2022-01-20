/*
 * pdfUtils.js
 * Copyright (C) 2021-2022 Nik Nyby
 *
 * This file is part of Mediathread.
 *
 * Mediathread is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Mediathread is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mediathread.  If not, see <https://www.gnu.org/licenses/>.
 */

// This is a magic number required by some scaling operations. This
// can be removed or renamed once we figure out what it is / why it's
// necessary.
const pdfjsScale = 0.75;

/**
 * Given co-ordinates for two points, return the co-ordinates that
 * Canvas or SVG expects:: top-left point x/y, then width/height.
 */
const convertPointsToXYWH = function(x1, y1, x2, y2, scale=1) {
    x1 *= scale;
    y1 *= scale;
    x2 *= scale;
    y2 *= scale;

    return [
        Math.min(x1, x2), Math.min(y1, y2),
        Math.abs(x2 - x1), Math.abs(y2 - y1)
    ];
};

const isValidAnnotation = function(annotation) {
    return (
        annotation &&
            annotation.geometry &&
            annotation.geometry.coordinates
    );
};

/**
 * Draw a rectangle annotation on the provided svgDraw surface, given
 * the annotation data.
 */
const drawAnnotation = function(
    svgDraw, annotation, scale=1, offsetX=0, offsetY=0
) {
    if (
        !annotation || !annotation.geometry ||
            !annotation.geometry.coordinates
    ) {
        console.error(
            'drawAnnotation error: coordinates not present',
            annotation);
        return;
    }

    const [x, y, width, height] = convertPointsToXYWH(
        annotation.geometry.coordinates[0][0],
        annotation.geometry.coordinates[0][1],
        annotation.geometry.coordinates[1][0],
        annotation.geometry.coordinates[1][1],
        pdfjsScale * scale
    );

    return svgDraw.rect(width, height)
        .move(x - offsetX, y - offsetY)
        .stroke({color: '#22f', width: 2})
        .fill('none');
};

export {
    pdfjsScale, convertPointsToXYWH,
    isValidAnnotation, drawAnnotation
};
