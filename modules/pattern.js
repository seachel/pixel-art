import { assertion } from './assertion.js';
import { names, defaults } from './application-constants.js';
// -*-*-*-*-*-*-*-*-*-
// Model
// -*-*-*-*-*-*-*-*-*-
// -------
// Pattern data
// -------
export class Pattern {
    constructor(onCellClick) {
        this.onCellClick = onCellClick;
    }
    /// A function to make a pattern given the cells
    // TODO: what to do when there are more fields in the pattern? something to read the pattern and pass that object in? Given a pattern, update the state and view?
    static makePatternFromCells(cells, onCellClick) {
        let pattern = new Pattern(onCellClick);
        pattern.initializePatternFromCells(cells);
        return pattern;
    }
    /// A function to make a pattern given the height and width of the grid
    static makePatternFromDimensions(height, width, onCellClick) {
        let pattern = new Pattern(onCellClick);
        pattern.initializePatternFromDimensions(height, width);
        return pattern;
    }
    // Note:
    // - pattern init from dimensions or cells
    initializePatternFromDimensions(height, width) {
        // TODO: Check that inputs are valid numbers, not NaN
        assertion.isNonNegative(height);
        assertion.isNonNegative(width);
        // TODO: this should be front-end validation rather than breaking?
        // set the cells of the object to defaults
        this.cells = this.getDefaultCells(height, width);
        // initialize the HTML elements corresponding to cells in the grid representing the pattern
        this.initializePatternView(height, width);
    }
    initializePatternFromCells(cells) {
        this.cells = cells;
        this.initializePatternView(this.getPatternHeight(), this.getPatternWidth());
    }
    getPatternHeight() {
        // TODO: verification that number can be returned
        if (this.cells && this.cells.length) {
            return this.cells.length;
        }
        else {
            return 0;
        }
    }
    getPatternWidth() {
        if (this.cells && this.cells.length > 0) {
            return this.cells[0].length;
        }
        else {
            return 0;
        }
    }
    // Returns html for a pattern object
    // The pattern is an HTML table with each td having an id defined by a function in the application constants
    getPatternHTML(height, width) {
        // get element where the pattern will be written
        // build the text for that element
        let patternHTML = `<table id="${names.patternGrid}">
		`;
        // For each row, up to `height`,
        //   start a `tr` tag
        //   for each column,
        //     start a td tag with appropriate id and class, both defined in application constants
        for (let i = 0; i < height; i++) {
            patternHTML += `<tr>
			`;
            for (let j = 0; j < width; j++) {
                patternHTML += `<td id="${defaults.cellId(i, j)}" class="${names.patternCellName}">
				-
				</td>
				`;
                // Note: "-" is temp content for cell
            }
            patternHTML += `</tr>
			`;
        }
        patternHTML += `</table>
		`;
        return patternHTML;
    }
    // Returns a grid of brushes (strings for now) with the default brush assigned
    getDefaultCells(height, width) {
        // cells is column of rows, so
        //   outer loop goes along/down the column
        //   the inner loop goes across each row
        let cells = [];
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push(defaults.cellColour);
            }
            cells.push(row);
        }
        return cells;
    }
    // This function hooks up the click events and sets the style of the brush on cells
    // Note: this must be called after the HTML for the pattern is on the page and the cells field of the pattern is set
    initializePatternView(height, width) {
        // write pattern HTML
        let patternContainer = document.getElementById(names.region_pattern);
        patternContainer.innerHTML = this.getPatternHTML(height, width);
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            for (let colIndex = 0; colIndex < width; colIndex++) {
                let currentCell = document.getElementById(defaults.cellId(rowIndex, colIndex));
                // TODO: hook up click event somewhere better? reserve this function for setting the brush?
                // hook up click event
                currentCell.addEventListener("click", this.onCellClick, false);
                currentCell.style.background = this.cells[rowIndex][colIndex];
            }
        }
    }
}
