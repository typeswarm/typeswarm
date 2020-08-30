#!/usr/bin/env node

import execa from 'execa';
import fs from 'fs';
import { dirname, join, resolve } from 'path';
import yargs from 'yargs';
import { buildComposeProject } from './buildComposeProject';
import { register } from 'ts-node';

register({});

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
        async ({ config, stack, context }) => {
            const configFileName = resolve(config);
            const configDir = dirname(configFileName);
            const targetDirBaseName =
                '.' +
                Math.floor(Math.random() * 1e9).toString(36) +
                '.enxame-bundle';
            const targetDir = join(configDir, targetDirBaseName);
            await fs.promises.mkdir(targetDir, { recursive: true });
            const { spec } = require(resolve(config));
            const { composeFile } = await buildComposeProject(spec, targetDir);

            const args = [
                'stack',
                'deploy',
                '--with-registry-auth',
                '--compose-file',
                composeFile,
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
        }
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
        async ({ config, output }) => {
            const configFileName = resolve(config);
            const targetDir = resolve(output);

            await fs.promises.mkdir(targetDir, { recursive: true });
            const { spec } = require(resolve(configFileName));
            await buildComposeProject(spec, targetDir);
        }
    ).argv;
