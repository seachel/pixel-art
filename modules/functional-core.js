import { Pattern } from './pattern.js';
// Core functions from the top-level module appropriate to use when writing tests
export function createNewPattern(patternHeight, patternWidth, onCellClick) {
    return new Pattern(patternHeight, patternWidth, onCellClick);
}
