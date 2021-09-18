#!/usr/bin/env node
import { Container } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { CLIApplication } from './CLIApplication';
import { ComposeBuilder } from './ComposeBuilder';
import { Types } from './di';
import { EntitiesProcessor } from './EntitiesProcessor';

const di = new Container();
di.bind<CLIApplication>(Types.CLIApplication).to(CLIApplication);
di.bind<ComposeBuilder>(Types.ComposeBuilder).to(ComposeBuilder);
di.bind<EntitiesProcessor>(Types.EntitiesProcessor).to(EntitiesProcessor);
di.bind<Logger>(Types.Logger).toConstantValue(
    new Logger({ displayFilePath: 'hidden' })
);

const app = di.get<CLIApplication>(Types.CLIApplication);
app.start();
