const isDebug = true;
export function writeDebug(debugObject = {}, debugMessage = "(no message provided)") {
    if (isDebug) {
        console.log(`***
${debugMessage}
---
${debugObject.toString()}
***
`);
    }
}
// Note: used for testing
export function writeToPage(thingToWrite) {
    // TODO: if not already on the page, add it
    let dumpElement = document.getElementById("dump");
    dumpElement.textContent += "\n" + thingToWrite;
}
