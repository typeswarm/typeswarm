#!/usr/bin/env node

import execa from 'execa';
import fs from 'fs';
import { dirname, join, resolve } from 'path';
import yargs from 'yargs';
import { buildComposeProject, COMPOSE_FILE_NAME } from './buildComposeProject';
import { register } from 'ts-node';
import { Logger } from 'tslog';

register({});

const logger = new Logger({
    displayFilePath: 'hidden',
});

const cmdRender = async ({
    config,
    output,
}: {
    config: string;
    output: string;
}) => {
    const configFileName = resolve(config);
    const targetDir = resolve(output);

    await fs.promises.mkdir(targetDir, { recursive: true });
    const { spec } = require(resolve(configFileName));
    await buildComposeProject(spec, targetDir, logger);
};

const cmdDeploy = async ({
    config,
    stack,
    context,
}: {
    config: string;
    stack: string;
    context?: string;
}) => {
    const targetDirBaseName =
        '.' + Math.floor(Math.random() * 1e9).toString(36) + '.enxame-bundle';
    const configFileName = resolve(config);
    const configDir = dirname(configFileName);
    const targetDir = join(configDir, targetDirBaseName);

    await cmdRender({
        config: configFileName,
        output: targetDir,
    });

    const args = [
        'stack',
        'deploy',
        '--with-registry-auth',
        '--compose-file',
        join(targetDir, COMPOSE_FILE_NAME),
        stack,
    ];
    if (context) {
        args.unshift('--context', context);
    }

    const subprocess = execa('docker', args);
    subprocess.stdout?.pipe(process.stdout);
    subprocess.stderr?.pipe(process.stderr);
    console.log('start');
    await subprocess;
    console.log('end');
};

yargs
    .command(
        'deploy',
        'deploy stack',
        {
            context: {
                alias: 'x',
                string: true,
            },
            config: {
                alias: 'c',
                demandOption: true,
                string: true,
            },
            stack: {
                alias: 's',
                demandOption: true,
                string: true,
            },
        },
        cmdDeploy
    )
    .command(
        'render',
        'render compose configuration',
        {
            config: {
                alias: 'c',
                demandOption: true,
                string: true,
            },
            output: {
                alias: 'o',
                demandOption: true,
                string: true,
            },
        },
        cmdRender
    ).argv;
