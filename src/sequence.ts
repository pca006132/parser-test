import {Node, Parser, Edit, ParserResult, LintResult} from "./types";

class SequenceNode extends Node {
    readonly length: number;
    constructor(id: number, readonly nodes: Node[]) {
        super(id);
        this.length = this.nodes.map(v => v.getLength()).reduce((acc, v) => acc + v, 0);
    }
    getStr() {
        return this.nodes.map(v => v.getStr()).join("");
    }
    getLength() {
        return this.length;
    }
}

export class SequenceParser implements Parser {
    constructor(readonly id: number, readonly parsers: Parser[]) {}
    parse(edit: Edit, line: string, node?: Node): ParserResult {
        function getNode(i: number) {
            if (node === undefined)
                return undefined;
            let listNode = node as SequenceNode;
            if (i < listNode.nodes.length)
                return listNode.nodes[i];
            return undefined;
        }
        if (node !== undefined) {
            if (node.id != this.id)
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

        let lints: LintResult = {errors: [], warnings: []};
        let nodes: Node[] = [];
        let offset = 0;

        for (let i = 0; i < this.parsers.length; i++) {
            let result = this.parsers[i].parse(edit, line, getNode(i));
            let length = result.node.getLength();
            edit = result.edit;
            nodes.push(result.node);
            lints.errors = lints.errors.concat(result.lint.errors.map(v => {v.offset += offset; return v;}));
            lints.warnings = lints.warnings.concat(result.lint.warnings.map(v => {v.offset += offset; return v;}));
            if (line.length === 0 && result.lint.errors.some(v => v.length === 0)) {
                // this should indicate missing element, no need to parse further
                break;
            }
            offset += length;
            line = line.substring(length);
        }

        return {
            lint: lints,
            node: new SequenceNode(this.id, nodes),
            edit: edit
        };
    }
}

