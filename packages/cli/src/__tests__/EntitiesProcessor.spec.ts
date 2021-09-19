import { StrictService } from '@typeswarm/core/lib/normalize';
import { Container } from 'inversify';
import { Logger } from 'tslog';
import { Types } from '../di';
import { EntitiesProcessor } from '../EntitiesProcessor';
import { FileStorageImpl_Mock, IFileStorage } from '../FileStorage';

function createContainer() {
    const di = new Container();
    di.bind<EntitiesProcessor>(Types.EntitiesProcessor).to(EntitiesProcessor);
    di.bind<IFileStorage>(Types.IFileStorage)
        .to(FileStorageImpl_Mock)
        .inSingletonScope();
    di.bind<Logger>(Types.Logger).toConstantValue(
        new Logger({ displayFilePath: 'hidden' })
    );
    return di;
}

describe('EntitiesProcessor', () => {
    it('should process both configs and secrets', async () => {
        const di = createContainer();

        const entitiesProcessor = di.get<EntitiesProcessor>(
            Types.EntitiesProcessor
        );

        const specWithRotatedConfigs = await entitiesProcessor.processEntities(
            'configs',
            {
                services: {
                    website: {
                        image: 'my-image:latest',
                        configs: [
                            {
                                source: 'website-config.yaml',
                                target: '/etc/app/config.yaml',
                            },
                        ],
                        secrets: [
                            {
                                source: 'website-credentials.yaml',
                                target: '/etc/app/credentials.yaml',
                            },
                        ],
                    } as StrictService,
                },
                configs: {
                    'website-config.yaml': {
                        data: 'hello: world',
                    },
                },
                secrets: {
                    'website-credentials.yaml': {
                        data: 'apiKey: "1234567890"',
                    },
                },
            },
            'build'
        );

        const specWithRotatedSecrets = await entitiesProcessor.processEntities(
            'secrets',
            specWithRotatedConfigs,
            'build'
        );

        expect(specWithRotatedSecrets).toMatchSnapshot();
        const fileStorage = di.get<FileStorageImpl_Mock>(Types.IFileStorage);
        expect(fileStorage.files).toMatchSnapshot();
    });
});
