import { spec } from "../example/router";

describe("router", () => {
  it("should generate a spec that matches the snapshot", () => {
    expect(spec).toMatchInlineSnapshot(`
      Object {
        "networks": Object {
          "proxy": Object {
            "external": true,
          },
        },
        "services": Object {
          "traefik": Object {
            "command": Array [
              "--api.insecure=true",
              "--providers.docker=true",
              "--providers.docker.swarmMode=true",
              "--providers.docker.watch=true",
              "--providers.docker.exposedbydefault=false",
              "--entrypoints.web.address=:80",
              "--entrypoints.websecure.address=:443",
              "--certificatesresolvers.letsencrypt_resolver.acme.httpchallenge=true",
              "--certificatesresolvers.letsencrypt_resolver.acme.httpchallenge.entrypoint=web",
              "--certificatesresolvers.letsencrypt_resolver.acme.caserver=https://acme-v02.api.letsencrypt.org/directory",
              "--certificatesresolvers.letsencrypt_resolver.acme.storage=/letsencrypt/acme.json",
              "--certificatesresolvers.letsencrypt_resolver.acme.email=example@example.com",
              "--log.level=DEBUG",
            ],
            "deploy": Object {
              "placement": Object {
                "constraints": Array [
                  "node.role == manager",
                ],
              },
            },
            "image": "traefik:v2.2",
            "networks": Object {
              "proxy": null,
            },
            "ports": Array [
              Object {
                "protocol": "tcp",
                "published": 80,
                "target": 80,
              },
              Object {
                "protocol": "tcp",
                "published": 443,
                "target": 443,
              },
            ],
            "volumes": Array [
              Object {
                "source": "traefik_letsencrypt_data",
                "target": "/letsencrypt",
                "type": "volume",
              },
              Object {
                "readOnly": true,
                "source": "/var/run/docker.sock",
                "target": "/var/run/docker.sock",
                "type": "volume",
              },
            ],
          },
        },
        "version": "3.8",
        "volumes": Object {
          "traefik_letsencrypt_data": null,
        },
      }
    `);
  });
});
