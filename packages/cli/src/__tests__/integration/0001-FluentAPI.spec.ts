import { Container } from 'inversify';
import { Logger } from 'tslog';
import {
    Service,
    Image,
    Cluster,
    Volume,
    ServiceVolume,
} from '@typeswarm/core';
import { Types } from '../../di';
import { EntitiesProcessor } from '../../EntitiesProcessor';
import { FileStorageImpl_Mock, IFileStorage } from '../../FileStorage';

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

describe('Integration-0001 Fluent API', () => {
    it('should process fluent config', () => {
        const databaseVolume = Volume('mariadb-data');
        const cacheVolume = Volume('redis-data');

        const srvCache = Service('cache')
            .image(Image('redis').tag('6.0'))
            .volume(ServiceVolume('/data').source(cacheVolume));

        const srvDb = Service('database')
            .image(Image('mariadb').tag('10'))
            .volume(ServiceVolume('/data').source(databaseVolume));

        const srvWebsite = Service('website')
            .image(Image('wordpress').tag('7.1'))
            .env('DATABASE_HOST', `${srvDb.data.name}`)
            .env('CACHE', `redis:${srvCache.data.name}`);

        const spec = Cluster('3.7')
            .service(srvCache)
            .service(srvWebsite)
            .service(srvDb)
            .volume(databaseVolume);
        expect(spec.data).toMatchSnapshot();
    });
});
