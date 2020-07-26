import {Parser} from "../src/types";
import {TextParserConfig} from "../src/text";

export function simpleTextParserConfig(id: number, text: string | RegExp, delimiter: string | RegExp): TextParserConfig {
    if (typeof text === "string") {
        // ugly hack, would lead to ugly error message, for test only
        text = `^${text}$`;
    }
    return {
        id: id,
        textLength: (line: string) => {
            const index = line.search(delimiter);
            if (index === -1)
                return line.length;
            return index;
        },
        validator: (t: string) => t.match(text) ? {errors: [], warnings: []} : {
            errors: [{
                offset: 0,
                length: t.length,
                message: `Expected "${text}" but got "${t}"`
            }],
            warnings: []
        },
        candidates: (_: string) => [],
    };
}

export function testRunner(edits: [number, number, string][], parser: Parser) {
    let line = "";
    let node = undefined;
    for (let [start, length, text] of edits) {
        line = line.substring(0, start) + text + line.substring(start + length);
        let result = parser.parse({
            offset: start,
            replacedLength: length,
            replacementLength: text.length
        }, line, node);
        node = result.node;
        console.log(`Line: ${line}`);
        console.log(node);
        console.log(result.lint);
        console.log();
    }
}
