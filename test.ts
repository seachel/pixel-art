function assert(value, message : string = "NO WORK.") : boolean
{
	if (value)
	{
		return true;
	}
	else
	{
		throw(message);
	}
}

function someThingTest()
{
	let moo = "hallo";
	assert(moo == "hfallo", "Expected to be 'hallo'");
}

someThingTest();

// let testPattern =

// let assert =
// {
// 	equal: (val1, val2) =>
// 	{
// 		if (val1 === val2)
// 		{
// 			return "FUCK YEA"
// 		}
// 	}
// }

// assert();

function throwIt(errorMessage : string)
{
	throw errorMessage;
	// TODO: log it on the page
}