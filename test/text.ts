import {TextParser} from "../src/text";
import {testRunner, simpleTextParserConfig} from "./utils";

export default function testTextParser() {
    let config = simpleTextParserConfig(0, "test", " ");
    let parser = new TextParser(config);

    let edits: [number, number, string][] = [
        [0, 0, ""],
        [0, 0, "test abcd"],
        [4, 0, "ab"],
        [4, 2, ""],
        [2, 0, " "],
        [2, 1, ""],
        [5, 0, "0"]
    ];
    testRunner(edits, parser);
}
