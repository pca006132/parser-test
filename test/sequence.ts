import {TextParser} from "../src/text";
import {SequenceParser} from "../src/sequence";
import {testRunner, simpleTextParserConfig} from "./utils";

export default function testSequenceParser() {
    let id = 0;
    let foo = simpleTextParserConfig(id++, "foo", " ");
    let bar = simpleTextParserConfig(id++, "bar", " ");
    let space = simpleTextParserConfig(id++, " ", /\b/);
    let parser = new SequenceParser(id++, [foo, space, bar].map(v => new TextParser(v)));

    let edits: [number, number, string][] = [
        [0, 0, ""],
        // foo
        [0, 0, "foo"],
        // fooar
        [3, 0, "ar"],
        // foo bar
        [2, 1, "o b"],
        // fo bar
        [2, 1, ""],
        // foo bar
        [2, 0, "o"],
        // fo o bar
        [2, 0, " "],
        // fo o
        [4, 4, ""],
        // foo
        [2, 1, ""],
    ];
    testRunner(edits, parser);
}
