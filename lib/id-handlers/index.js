const putIds = (code) =>
{
    const stack = [];
    const openingsStack = []
    let currentCode = code;
    let i = 0;
    let counter = 0;

    while(currentCode.length > i)
    {
        if
        (
            currentCode[i] === "L" &&
            currentCode[i+1] === "e" &&
            currentCode.slice(i, i+18) === "Lex.createElement("
        )
        {
            stack.push("opening");
            openingsStack.push(i);
            i += 17;
        }
        else if(currentCode[i] === "(")
        {
            stack.push("auxiliar")
        }
        else if(currentCode[i] === ")")
        {
            if(stack.pop() === "opening")
            {
                weAreInAId = true;
                
                openingsStack.pop();
                currentCode = currentCode.slice(0, i+1) + `(${counter})` + currentCode.slice(i+1, currentCode.length)
                counter++;   
            }
        }
        i++;
    }
    return currentCode;
}

const replaceToSelect = (code, list) =>
{
    const stack = [];
    const openingsStack = []
    let currentCode = code;
    let i = 0;
    let counter = 0;

    while(currentCode.length > i)
    {
        if
        (
            currentCode[i] === "L" &&
            currentCode[i+1] === "e" &&
            currentCode.slice(i, i+18) === "Lex.createElement("
        )
        {
            stack.push("opening");
            openingsStack.push(i);
            i += 17;
        }
        else if(currentCode[i] === "(")
        {
            stack.push("auxiliar")
        }
        else if(currentCode[i] === ")")
        {
            if(stack.pop() === "opening")
            {
                weAreInAId = true;
                
                const open = openingsStack.pop();

                if(list.includes(counter))
                {
                    currentCode = currentCode.slice(0, open)
                    + "Lex.selectElement"
                    + currentCode.slice(open + 17, currentCode.length);
                }

                counter++;
            }
        }
        i++;
    }
    return currentCode;
}

module.exports = { putIds, replaceToSelect };