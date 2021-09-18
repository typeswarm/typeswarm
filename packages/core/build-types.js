const axios = require('axios');
const { compile } = require('json-schema-to-typescript');
const fs = require('fs');

const SCHEMA_URL =
    'https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json';

const TYPES_FILE = `${__dirname}/src/compose-spec.ts`;

const main = async () => {
    const { data: schema } = await axios.get(SCHEMA_URL);
    const ts = await compile(schema);
    fs.promises.writeFile(TYPES_FILE, ts, 'utf-8');
};

main().catch((e) => {
    console.error(e.stack);
    process.exit(1);
});
