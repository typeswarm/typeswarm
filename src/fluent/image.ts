import { _makeWhen, _makeWith } from './common';

interface ImageData {
    image: string;
    tag?: string;
}

export class FluentImage {
    constructor(public readonly data: ImageData) {}
    with = _makeWith<FluentImage>(this);
    when = _makeWhen<FluentImage>(this);

    tag(tag: string) {
        return new FluentImage({ ...this.data, tag });
    }

    toString(): string {
        const { tag, image } = this.data;
        if (!tag) return image;
        return `${image}:${tag}`;
    }
}

export const ImageFactory = (image: string) => new FluentImage({ image });
