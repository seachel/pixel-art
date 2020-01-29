export { assertion };

// Use the assertions below to create pre-conditions, post-conditions, or any other assertions where breaking execution is the preferred behaviour when not true
// How to know when to use: consider it whenever creating a new variable
// use isNum check on string before using `Number` function to get more information
export const assertion =
{
	isEqual: (checkVal1, checkVal2) =>
	{
		if (checkVal1 !== checkVal2)
		{
			throwIt(`${checkVal1} != ${checkVal2}.`);
		}
	},
	isNum: (checkVal : any) =>
	{
		if (isNaN(Number(checkVal)))
		{
			throwIt(`${checkVal} is not a number.`);
		}
	},
	isNonNegative: (checkVal : number) =>
	{
		if (isNaN(checkVal))
		{
			throwIt(`${checkVal} passed to check non-negative :(`)
		}
		if (checkVal < 0)
		{
			throwIt(`${checkVal} should be nonnegative`);
		}
	},
	isNotNull: (checkVal : any) =>
	{
		if (checkVal === null)
		{
			throwIt(`${checkVal} is null.`)
		}
	},
	isNotUndefined: (checkVal : any) =>
	{
		if (checkVal === undefined)
		{
			throwIt(`${checkVal} is undefined.`)
		}
	},
	isNonempty: (checkArray : Array<any>) =>
	{
		if (checkArray.length === 0)
		{
			throwIt(`${checkArray} is an empty array.`)
		}
	},
	hasLength: (checkArray : Array<any>, length : number) =>
	{
		if (checkArray.length !== length)
		{
			throwIt(`${checkArray} has length ${checkArray.length} instead of desired length ${length}`);
		}
	}
}


// Exception handling for this page
function throwIt(exceptionMsg : string)
{
	console.log(exceptionMsg);

	let errorDisplayElement = document.getElementById(names.errorDisplay);

	// If an element for displaying errors is not yet on the page, create it
	if (errorDisplayElement === null || errorDisplayElement === undefined)
	{
		errorDisplayElement = document.createElement("div");
		errorDisplayElement.id = names.errorDisplay;

		document.body.appendChild(errorDisplayElement);
	}

	let newMessage = document.createElement("div");
	newMessage.classList.add(names.errorMessage);
	newMessage.textContent = exceptionMsg;

	errorDisplayElement.appendChild(newMessage);
}


// Exception handling for this page
function throwIt(exceptionMsg : string)
{
	console.log(exceptionMsg);

	let errorDisplayElement = document.getElementById(names.errorDisplay);

	// If an element for displaying errors is not yet on the page, create it
	if (errorDisplayElement === null || errorDisplayElement === undefined)
	{
		errorDisplayElement = document.createElement("div");
		errorDisplayElement.id = names.errorDisplay;

		document.body.appendChild(errorDisplayElement);
	}

	let newMessage = document.createElement("div");
	newMessage.classList.add(names.errorMessage);
	newMessage.textContent = exceptionMsg;

	errorDisplayElement.appendChild(newMessage);
}
