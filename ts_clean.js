const fs = require('fs');
const ts = require('typescript');

const targetFile = 'src/config/calculators.ts';
const sourceText = fs.readFileSync(targetFile, 'utf8');

const sourceFile = ts.createSourceFile(
    targetFile,
    sourceText,
    ts.ScriptTarget.Latest,
    true
);

function transform(node) {
    if (ts.isObjectLiteralExpression(node)) {
        // Collect properties
        const props = node.properties;
        const uniqueProps = new Map();
        const finalProps = [];

        // Reverse iterate to keep the last one easily
        for (let i = props.length - 1; i >= 0; i--) {
            const prop = props[i];
            if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
                const name = prop.name.getText(sourceFile);
                if (!uniqueProps.has(name)) {
                    uniqueProps.set(name, prop);
                    finalProps.unshift(prop);
                }
            } else {
                finalProps.unshift(prop);
            }
        }

        // Recursively transform nested objects
        const transformedProps = finalProps.map(p => ts.visitEachChild(p, transform, undefined));
        return ts.factory.updateObjectLiteralExpression(node, transformedProps);
    }
    return ts.visitEachChild(node, transform, undefined);
}

// Special case: we only want to deduplicate properties within the calculators object
// and its immediate children (the calculators themselves) and maybe meta.
// DANGER: Deduplicating properties in EVERYTHING might break some logic if properties were intended.
// But in a config object, it's usually safe.

const result = ts.transform(sourceFile, [
    (context) => (root) => {
        function visit(node) {
            if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === 'calculators') {
                // This is the calculators object declaration
                return ts.visitEachChild(node, visitObjectRec, context);
            }
            return ts.visitEachChild(node, visit, context);
        }

        function visitObjectRec(node) {
            if (ts.isObjectLiteralExpression(node)) {
                const props = node.properties;
                const uniqueProps = new Map();
                const resultProps = [];
                // Keep last
                for (let i = props.length - 1; i >= 0; i--) {
                    const prop = props[i];
                    let key = null;
                    if (prop.name) key = prop.name.getText(sourceFile);

                    if (key && !uniqueProps.has(key)) {
                        uniqueProps.set(key, true);
                        resultProps.unshift(ts.visitEachChild(prop, visitObjectRec, context));
                    } else if (!key) {
                        resultProps.unshift(ts.visitEachChild(prop, visitObjectRec, context));
                    }
                }
                return ts.factory.updateObjectLiteralExpression(node, resultProps);
            }
            return ts.visitEachChild(node, visitObjectRec, context);
        }

        return ts.visitNode(root, visit);
    }
]);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const transformedSourceFile = result.transformed[0];
const output = printer.printFile(transformedSourceFile);

fs.writeFileSync(targetFile, output);
console.log('Successfully de-duplicated properties using TS Compiler API.');
