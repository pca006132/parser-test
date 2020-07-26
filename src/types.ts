export type Message = {
    offset: number;
    length: number;
    message: string;
}

export type Edit = {
    offset: number;
    replacedLength: number;
    replacementLength: number;
}

export type LintResult = {
    errors: Message[];
    warnings: Message[];
}

export type ParserResult = {
    lint: LintResult;
    node: Node;
    edit: Edit;
}

export abstract class Node {
    constructor(readonly id: number) {}
    abstract getStr(): string;
    abstract getLength(): number;
}

export interface Parser {
    parse(edit: Edit, line: string, node?: Node): ParserResult;
}


