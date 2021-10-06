import { spec } from "../example/router";

describe("router", () => {
  it("should generate a spec that matches the snapshot", () => {
    expect(spec).toMatchInlineSnapshot(`
      Object {
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
            "image": "traefik:v2.2",
            "ports": Array [
              Object {
                "protocol": undefined,
                "published": 80,
                "target": 80,
              },
              Object {
                "protocol": undefined,
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
