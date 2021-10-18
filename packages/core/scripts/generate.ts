import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import prettier from 'prettier';

const rulesFile = join(__dirname, '..', 'src', 'fluent', 'generate.yaml');
const generatedFolder = join(__dirname, '..', 'src', 'fluent', 'generated');

interface SetMethodDef {
    [methodName: string]: { [path: string]: string };
}
interface FlagMethodDef {
    [methodName: string]: { [path: string]: any };
}

type DTODef = {
    className: string;
} & (
    | { module: string }
    | {
          definition: string;
      }
);
interface Rule {
    className: string;
    imports?: {
        [importName: string]: string;
    };
    dto: DTODef;
    methods: {
        set?: SetMethodDef;
        dict?: SetMethodDef;
        flag?: FlagMethodDef;
    };
}

async function main() {
    const generateYaml = await readFile(rulesFile, 'utf8');
    const rules: Rule[] = YAML.parse(generateYaml);

    await mkdir(generatedFolder, { recursive: true });

    for (const rule of rules) {
        const moduleSource = processRule(rule);
        const moduleSourcePrettified = prettier.format(moduleSource, {
            parser: 'typescript'
        });
        const fileName = join(generatedFolder, `${rule.className}.ts`);
        console.log(`Writing file: "${fileName}"`);
        await writeFile(fileName, moduleSourcePrettified, 'utf8');
    }
}

function createImports(rule: Rule) {
    const imports = [];
    if ('module' in rule.dto) {
        imports.push(
            `import {${rule.dto.className}} from ${JSON.stringify(
                rule.dto.module
            )};`
        );
    }
    imports.push("import {immerable} from 'immer';");

    if (rule.methods.set || rule.methods.flag) {
        imports.push("import {propset} from '../utils'");
    }

    for (const [names, path] of Object.entries(rule.imports ?? {})) {
        imports.push(`import ${names} from ${JSON.stringify(path)}`);
    }
    return imports.join('\n');
}

function createDefinitions(rule: Rule) {
    const definitions = [];
    if ('definition' in rule.dto) {
        definitions.push(
            `interface ${rule.dto.className} ${rule.dto.definition}`
        );
    }
    return definitions.join('\n');
}

function createConstructor(rule: Rule) {
    return `constructor(public readonly data: ${rule.dto.className}) {}`;
}

function createSetMethod(methodName: string, path: string, valueType: string) {
    const pathStr = JSON.stringify(path);
    return `${methodName}(value: ${valueType}) { return propset(this, ${pathStr}, value); }`;
}

function createDictMethod(methodName: string, path: string, valueType: string) {
    const pathStr = JSON.stringify(path);
    return `${methodName}(key: string, value: ${valueType}) { return propset(this, ${pathStr} + "." + key, value); }`;
}

function createFlagMethod(methodName: string, path: string, value: any) {
    const pathStr = JSON.stringify(path);
    const valueStr = JSON.stringify(value);
    return `${methodName}() { return propset(this, ${pathStr}, ${valueStr}); }`;
}

function createClass(
    className: string,
    constructor: string,
    methods: string[]
) {
    return `export class ${className} {
        static [immerable]=true;
        ${constructor}
        ${methods.join('\n')}
    }
    `;
}

function processRule(rule: Rule) {
    const imports = createImports(rule);
    const definitions = createDefinitions(rule);
    const constructor = createConstructor(rule);
    const methods = [];

    for (const [methodName, pathAndType] of Object.entries(
        rule.methods.set ?? {}
    )) {
        const [path, valueType] = Object.entries(pathAndType)[0];
        methods.push(createSetMethod(methodName, path, valueType));
    }

    for (const [methodName, pathAndType] of Object.entries(
        rule.methods.dict ?? {}
    )) {
        const [path, valueType] = Object.entries(pathAndType)[0];
        methods.push(createDictMethod(methodName, path, valueType));
    }

    for (const [methodName, pathAndValue] of Object.entries(
        rule.methods.flag ?? {}
    )) {
        const [path, value] = Object.entries(pathAndValue)[0];
        methods.push(createFlagMethod(methodName, path, value));
    }

    const classDef = createClass(rule.className, constructor, methods);
    return `${imports}\n${definitions}\n${classDef}`;
}

main().catch(e => {
    console.error(e.stack ?? e);
    process.exit(1);
});
