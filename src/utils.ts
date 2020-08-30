import md5 from 'md5';

export const getHash = (input: string) => {
    return md5(input).substr(0, 8);
};
