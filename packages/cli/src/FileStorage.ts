import { readFile, writeFile } from 'fs/promises';
import { injectable } from 'inversify';

export interface IFileStorage {
    read(fileName: string): Promise<string>;
    write(fileName: string, contents: string): Promise<void>;
}

@injectable()
export class FileStorageImpl_Real implements IFileStorage {
    read(fileName: string): Promise<string> {
        return readFile(fileName, 'utf8');
    }
    write(fileName: string, contents: string): Promise<void> {
        return writeFile(fileName, contents, 'utf8');
    }
}

@injectable()
export class FileStorageImpl_Mock implements IFileStorage {
    public files: Record<string, string> = {};

    read(fileName: string): Promise<string> {
        if (!this.files[fileName]) {
            throw new Error(`File not found: ${fileName}`);
        }
        return Promise.resolve(this.files[fileName]);
    }

    write(fileName: string, contents: string): Promise<void> {
        this.files[fileName] = contents;
        return Promise.resolve();
    }
}
