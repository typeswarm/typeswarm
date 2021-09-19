import { swarm } from '../swarm';

describe('config', () => {
    it('should set all values', () => {
        expect(
            swarm
                .Config('hello')
                .text('hello: world')
                .externalName('shit').data
        ).toMatchInlineSnapshot(`
            Object {
              "config": Object {
                "data": "hello: world",
                "external": Object {
                  "name": "shit",
                },
              },
              "name": "hello",
            }
        `);

        expect(swarm.Config('hello').yaml({ foo: 'bar' }).data)
            .toMatchInlineSnapshot(`
            Object {
              "config": Object {
                "data": "foo: bar
            ",
              },
              "name": "hello",
            }
        `);

        expect(swarm.Config('hello').json({ foo: 'bar' }).data)
            .toMatchInlineSnapshot(`
            Object {
              "config": Object {
                "data": "{
              \\"foo\\": \\"bar\\"
            }",
              },
              "name": "hello",
            }
        `);
    });
});
