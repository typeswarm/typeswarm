import { swarm } from './swarm';

export default (args: any) => {
    const isDevelopment = args.get('environment') === 'development';
    const isProduction = args.get('environment') === 'production';

    const redisDataVolume = swarm.Volume('redis-data');

    const redisService = swarm
        .Service('redis')
        .image(swarm.Image('redis').tag('6.2.5'))
        .env('HELLO', 'world')
        .when(process.env.NODE_ENV === 'production', (s) =>
            s.env('MODE', 'production')
        )
        .when(process.env.NODE_ENV === 'development', (s) =>
            s.port(swarm.Port(6193).as(16183))
        )
        .volume(swarm.ServiceVolume('/data').source(redisDataVolume));

    const botService = swarm
        .Service('notifier')
        .image(
            swarm
                .Image('https://myregistry.com/company/notifier-bot')
                .tag('0.1.18')
        )
        .env('REDIS', `redis://${redisService.data.name}`)
        .env('TELEGRAM_TOKEN', args.require('telegramToken'));

    const adminerService = swarm
        .Service('adminer')
        .image('adminer:latest')
        .port(swarm.Port(8080).as(18080));

    return swarm
        .Cluster('3.8')
        .service(redisService)
        .service(botService)
        .when(isDevelopment, (_) => _.service(adminerService))
        .volume(redisDataVolume);
};
