import { assertion } from './assertion.js';
import { names, defaults } from './application-constants.js';
export { _Pattern as Pattern };
// -*-*-*-*-*-*-*-*-*-
// Model
// -*-*-*-*-*-*-*-*-*-
// -------
// Pattern data
// -------
export class _Pattern {
    constructor(height, width, onCellClick) {
        // TODO: Check that inputs are valid numbers, not NaN
        assertion.isNonNegative(height);
        assertion.isNonNegative(width);
        // TODO: this should be front-end validation rather than breaking?
        // provide the passed handler to use when a cell is clicked
        this.onCellClick = onCellClick;
        // write pattern HTML
        let patternContainer = document.getElementById(names.region_pattern);
        patternContainer.innerHTML = this.getPatternHTML(height, width);
        // initialize the HTML elements corresponding to cells in the grid representing the pattern
        this.initializeCellViews();
        // set the cells of the object to defaults
        this.cells = this.initializeCells(height, width);
    }
    // TODO: update function with functions to write html elements
    getPatternHTML(height, width) {
        // get element where the pattern will be written
        // build the text for that element
        let patternHTML = `<table id="${names.patternGrid}">
		`;
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
    initializeCells(height, width) {
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
    initializeCellViews() {
        // Add event listener to cells
        const viewCells = document.getElementsByClassName(names.patternCellName);
        for (var i = 0; i < viewCells.length; i++) {
            let currentCell = viewCells[i];
            // hook up click event
            currentCell.addEventListener("click", this.onCellClick, false);
            // style background with default
            currentCell.style.background = defaults.cellColour;
        }
    }
}
