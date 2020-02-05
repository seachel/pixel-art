import { assertion } from './assertion.js';
export function verifyAndCastToNumber(inputValue) {
    // Check that pattern dimension values are numbers
    assertion.isNum(inputValue);
    return Number(inputValue);
}
