import { assertion } from './assertion.js';

export function verifyAndCastToNumber(inputValue : string) : number
{
	// Check that pattern dimension values are numbers
	assertion.isNum(inputValue);

	return Number(inputValue);
}

export function getStringFromInputID(elementID : string) : string
{
	let inputElement = <HTMLInputElement> document.getElementById(elementID)

	return inputElement.value;
}