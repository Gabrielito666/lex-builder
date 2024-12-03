const MARK_COMMENT_OPEN = "/*#a$s%d&f(g)h?j";
const MARK_COMMENT_CLOSE = "#a$s%d&f(g)h?j*/";

const commentAsync = code =>
{
    let currentCode = code;
    let i = 0;

    let weAreInAsyncFunction = false;
    let functionType = undefined;

    while(i<currentCode.length)
    {
        if(!weAreInAsyncFunction)
        {
            if(currentCode.slice(i, i+5) === "async")
            {
                weAreInAsyncFunction = true;
            
                while(true)
                {
                    const char = currentCode[i];
                    if(char === "{")
                    {
                        functionType = "normal";
                        break
                    }
                    else if(char === "=" && currentCode[i+1] === ">")
                    {
                        functionType = "arrow-undefined";
                        i++; i++;
                    }
                    else if(functionType === "arrow-undefined" && char === "{")
                    {
                        functionType = "normal"
                        break
                    }
                    else if(functionType === "arrow-undefined" && !["\n", "\t", " ", "{"].includes(char))
                    {
                        functionType = "arrow-body-less"
                        break
                    }
                    else
                    {
                        i++
                    }
                }
                currentCode = currentCode.slice(0, i+1) + MARK_COMMENT_OPEN + currentCode.slice(i+1);
            }
            else i++
        }
        else
        {
            if(functionType === "normal")
            {
                let openingLlaves = 0;
                while(weAreInAsyncFunction && i<currentCode.length)
                {
                    if(currentCode[i] === '{') openingLlaves++;
                    else if(currentCode[i] === '}') openingLlaves--;
                    if(currentCode[i] === "}" && openingLlaves === 0) weAreInAsyncFunction = false;
                    i++
                }
                currentCode = currentCode.slice(0, i-1) + MARK_COMMENT_CLOSE + currentCode.slice(i-1);
                weAreInAsyncFunction = false;
            }
            else
            {
                let openingLlaves = 0;
                let openingParentesis = 0;
                let openingCorchetes = 0;

                while(weAreInAsyncFunction && i<currentCode.length)
                {
                    if(currentCode[i] === '{') openingLlaves++;
                    else if(currentCode[i] === '}') openingLlaves--;
                    else if(currentCode[i] === '(') openingParentesis++;
                    else if(currentCode[i] === ')') openingParentesis--
                    else if(currentCode[i] === '[') openingCorchetes++
                    else if(currentCode[i] === ']') openingCorchetes--
                    if
                    (
                        [";", "\n"].includes(currentCode[i]) && 
                        [openingLlaves, openingParentesis, openingCorchetes].every(x => x===0)
                    ) weAreInAsyncFunction = false;
                    i++
                }
                currentCode = currentCode.slice(0, i+1) + MARK_COMMENT_CLOSE + "null;" + currentCode.slice(i);
            }
        }
    }
    return currentCode.replace(/\/\*\s*@__PURE__\s*\*\//g, '');
}

module.exports = {commentAsync };