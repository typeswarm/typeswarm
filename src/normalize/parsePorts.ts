import { StrictPortMapping } from './models';
import { DefinitionsService } from '../compose-spec';
import { range } from 'lodash';

export function parsePorts(
    ports: DefinitionsService['ports']
): StrictPortMapping[] | undefined {
    if (!ports) {
        return undefined;
    }
    if (!ports.length) {
        return [];
    }

    return ports.flatMap(parsePort);
}

function parsePort(
    port: StrictPortMapping | number | string
): StrictPortMapping[] {
    if (typeof port === 'number') {
        return [
            {
                target: port,
            },
        ];
    }
    if (typeof port === 'string') {
        return parsePortStr(port);
    }
    return [port];
}

function parsePortStr(mappingWithProto: string): StrictPortMapping[] {
    const [mapping, proto] = mappingWithProto.split('/');
    const groups = mapping.match(/((\d+(-\d+)?):)?(\d+(-\d+)?)$/);
    if (!groups) {
        throw new SyntaxError(
            `Could not parse port mapping ${mappingWithProto}`
        );
    }
    const publishedRange =
        groups[2] === undefined ? undefined : parseRange(groups[2]);
    const targetRange = parseRange(groups[4]);

    if (targetRange && publishedRange) {
        if (targetRange.length !== publishedRange.length) {
            throw new RangeError(`Unequal port ranges ${mappingWithProto}`);
        }
    }

    return targetRange.map((targetPort, i) => {
        const mapping: StrictPortMapping = {};
        mapping.target = targetPort;
        if (publishedRange !== undefined) {
            mapping.published = publishedRange[i];
        }
        if (proto !== undefined) {
            mapping.protocol = proto;
        }
        return mapping;
    });
}

function parseRange(portOrRange: string): number[] {
    const groups = portOrRange.match(/^(\d+)(-(\d+))?$/);
    if (!groups) {
        throw new SyntaxError(`Could not parse port range ${portOrRange}`);
    }
    const start = parseInt(groups[1]);
    const end = groups[3] === undefined ? start : parseInt(groups[3]);

    if (end < start) {
        throw new RangeError(`Invalid ports range ${portOrRange}`);
    }
    if (end - start > 1000) {
        throw new RangeError(`Too big ports range ${portOrRange}`);
    }
    return range(start, end + 1);
}
