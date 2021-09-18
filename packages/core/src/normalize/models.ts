import {
    ComposeSpecification,
    DefinitionsService,
    DefinitionsDeployment,
} from '../compose-spec';

//https://stackoverflow.com/questions/51465182/typescript-remove-index-signature-using-mapped-types
//https://github.com/microsoft/TypeScript/issues/25987#issuecomment-870515762
export type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: never
  }
  

export interface StrictPortMapping {
    mode?: string;
    target?: number;
    published?: number;
    protocol?: string;

    [k: string]: unknown; //Left for backwards compatibility
}

export interface Dictionary {
    [k: string]: string | number | boolean | null;
}

export interface StrictConfig {
    source?: string;
    target?: string;
    uid?: string;
    gid?: string;
    mode?: number;

    [k: string]: unknown; //Left for backwards compatibility
}

export interface StrictVolume {
    type: string;
    source?: string;
    target?: string;
    read_only?: boolean;
    consistency?: string;
    bind?: {
        propagation?: string;
    };
    volume?: {
        nocopy?: boolean;
    };
    tmpfs?: {
        size?: number;
    };

    [k: string]: unknown; //Left for backwards compatibility
}

export interface StrictNetwork {
    aliases?: string[];
    ipv4_address?: string;
    ipv6_address?: string;
    link_local_ips?: string[];
    priority?: number;

    [k: string]: unknown; //Left for backwards compatibility
}

export type StrictDeployment = Omit<
    Pick<DefinitionsDeployment, KnownKeys<DefinitionsDeployment>>,
    'labels'
> & {
    labels?: Dictionary;
};

export type StrictService = Omit<
    Pick<DefinitionsService, KnownKeys<DefinitionsService>>,
    | 'environment'
    | 'deploy'
    | 'labels'
    | 'ports'
    | 'volumes'
    | 'configs'
    | 'secrets'
    | 'networks'
> & {
    ports?: StrictPortMapping[];
    environment?: Dictionary;
    deploy?: StrictDeployment;
    labels?: Dictionary;
    volumes?: StrictVolume[];
    configs?: StrictConfig[];
    secrets?: StrictConfig[];
    networks?: {
        [k: string]: StrictNetwork | null;
    };
};

export type StrictServicesDict = {
    [k: string]: StrictService;
};

export type StrictSpecification = Omit<
    Pick<ComposeSpecification, KnownKeys<ComposeSpecification>>,
    'services'
> & {
    services?: {
        [k: string]: StrictService;
    };
};
