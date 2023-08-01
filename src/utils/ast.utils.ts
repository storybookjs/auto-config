// @ts-expect-error
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { babelParse } from '@storybook/csf-tools';

export const createNode = (code: string) => {
    const result = babelParse(code);
    return result.program.body;
};

export const addImports = (ast: t.File, statements: t.Statement[]) => {
    let inserted = false;

    traverse(ast, {
        // @ts-expect-error
        Statement: (path) => {
            if (inserted) return;

            if (!path.isImportDeclaration()) {
                path.insertBefore(statements);
                inserted = true;
            }
        },
    });
};
