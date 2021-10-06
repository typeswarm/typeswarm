import { spec } from '../example/application-stack';

describe('publishToTraefik', () => {
    it('should generate a spec that matches the snapshot', () => {
        expect(spec).toMatchInlineSnapshot(`
      Object {
        "services": Object {
          "db": Object {
            "environment": Object {
              "MYSQL_DATABASE": "exampledb",
              "MYSQL_PASSWORD": "wyv9whew79etvg89JOI023gfbF",
              "MYSQL_RANDOM_ROOT_PASSWORD": "1",
              "MYSQL_USER": "exampleuser",
            },
            "image": "mysql:5.7",
            "volumes": Array [
              Object {
                "source": "db",
                "target": "/var/lib/mysql",
                "type": "volume",
              },
            ],
          },
          "wordpress": Object {
            "deploy": Object {
              "labels": Object {
                "traefik.docker.network": "shared_proxy",
                "traefik.enable": "true",
                "traefik.http.routers.wordpress.entrypoints": "websecure",
                "traefik.http.routers.wordpress.rule": "Host(\`wp.example.com\`)",
                "traefik.http.routers.wordpress.tls.certresolver": "letsencrypt_resolver",
                "traefik.http.services.wordpress.loadbalancer.server.port": 80,
                "traefik.http.services.wordpress.loadbalancer.server.scheme": "http",
              },
            },
            "environment": Object {
              "WORDPRESS_DB_HOST": "db",
              "WORDPRESS_DB_NAME": "exampledb",
              "WORDPRESS_DB_PASSWORD": "wyv9whew79etvg89JOI023gfbF",
              "WORDPRESS_DB_USER": "exampleuser",
            },
            "image": "wordpress",
            "networks": Object {
              "shared_proxy": Object {
                "name": "shared_proxy",
                "network": null,
              },
            },
            "volumes": Array [
              Object {
                "source": "wordpress",
                "target": "/var/www/html",
                "type": "volume",
              },
            ],
          },
        },
        "version": "3.8",
      }
    `);
    });
});
