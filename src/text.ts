import {Edit, ParserResult, LintResult, Node, Parser} from "./types";

class TextNode extends Node {
    constructor(id: number, level: number, readonly text: string) {
        super(id, level);
    }

    getStr(): string {
        return this.text;
    }

    getLength(): number {
        return this.text.length;
    }
}

export type TextParserConfig = {
    id: number;
    textLength: (line: string) => number;
    validator: (text: string) => LintResult;
    // this is currently not used yet
    candidates: (text: string) => string[];
}

export class TextParser implements Parser {
    constructor(readonly config: TextParserConfig) {}

    parse(edit: Edit, line: string, level: number, node?: Node): ParserResult {
        let replacedLength = edit.offset + edit.replacedLength;
        if (node !== undefined) {
            replacedLength -= node.getLength();
            if (node.id != this.config.id)
                throw "EXPECTED SAME ID";
            if (edit.offset > node.getLength()) {
                edit.offset -= node.getLength();
                return {
                    lint: {errors: [], warnings: []},
                    node: node,
                    edit: edit
                };
            }
        }
        let length = this.config.textLength(line);
        let replacementLength = edit.offset + edit.replacementLength - length;
        if (replacementLength < 0) {
            // we consumed additional text not in the edit
            replacedLength -= replacementLength;
            replacementLength = 0;
        }
        if (replacedLength < 0) {
            replacedLength = 0;
        }
        let text = line.substr(0, length);
        return {
            lint: this.config.validator(text),
            node: new TextNode(this.config.id, level, text),
            edit: {
                offset: 0,
                replacedLength: replacedLength,
                replacementLength: replacementLength,
            }
        };
    }
}

