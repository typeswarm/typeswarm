import { injectable, inject } from 'inversify';
import { Types } from './di';
import { ComposeBuilder, COMPOSE_FILE_NAME } from './ComposeBuilder';
import { resolve, dirname, join } from 'path';
import fs from 'fs';
import execa from 'execa';
import yargs from 'yargs';
import { register } from 'ts-node';
import { config as dotenvConfig } from 'dotenv';

@injectable()
export class CLIApplication {
    constructor(
        @inject(Types.ComposeBuilder)
        private composeBuilder: ComposeBuilder
    ) {}

    async commandRender({
        config,
        output,
        envFile,
    }: {
        config: string;
        output: string;
        envFile?: string;
    }) {
        const configFileName = resolve(config);
        const targetDir = resolve(output);

        await fs.promises.mkdir(targetDir, { recursive: true });
        if (envFile) {
            dotenvConfig({
                path: envFile,
            });
        }
        const { spec } = require(resolve(configFileName));
        const specValue = typeof spec === 'function' ? await spec() : spec;
        await this.composeBuilder.build(specValue, targetDir);
    }

    async commandDeploy({
        config,
        stack,
        context,
        envFile,
    }: {
        config: string;
        stack: string;
        context?: string;
        envFile?: string;
    }) {
        const targetDirBaseName =
            '.' + Math.floor(Math.random() * 1e9).toString(36) + '.compose';
        const configFileName = resolve(config);
        const configDir = dirname(configFileName);
        const targetDir = join(configDir, targetDirBaseName);

        await this.commandRender({
            config: configFileName,
            output: targetDir,
            envFile,
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
    }

    async start() {
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
                    envFile: {
                        alias: 'e',
                        demandOption: false,
                        string: true,
                    },
                    stack: {
                        alias: 's',
                        demandOption: true,
                        string: true,
                    },
                },
                this.commandDeploy.bind(this)
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
                    envFile: {
                        alias: 'e',
                        demandOption: false,
                        string: true,
                    },
                    output: {
                        alias: 'o',
                        demandOption: true,
                        string: true,
                    },
                },
                this.commandRender.bind(this)
            ).argv;
    }
}
