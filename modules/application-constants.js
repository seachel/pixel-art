// Below is an interface for id and class names shared between HTML, TS/JS, and CSS
// Only use the fields in name in this file for easier referencing and renaming later
// If changing any of the strings, be sure they are also updated in the TS and CSS files
export const names = {
    currentBrush: "current-brush",
    isMatchBrush: "is-match-brush",
    patternHeight: "pattern-height",
    patternWidth: "pattern-width",
    patternGrid: "table_pattern",
    patternCellName: "pattern-cell",
    button_createPattern: "btn_make-grid",
    button_savePattern: "btn_save-pattern",
    button_loadPattern: "btn_load-pattern",
    appContainer: "app-content",
    region_settings: "region-settings",
    region_pattern: "region-pattern",
    region_brush: "region-brush",
    errorDisplay: "error-display",
    errorMessage: "error-message"
};
// Wrapped defaults
export const defaults = {
    cellColour: "white",
    patternHeight: "3",
    patternWidth: "3",
    cellId: (row, column) => `row${row}-col${column}`
};
