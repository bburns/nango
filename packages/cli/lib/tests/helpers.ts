import path from 'path';
import fs from 'fs/promises';

export const copyDirectoryAndContents = async (source: string, destination: string) => {
    // source = path.join(...source.split('/'));
    // destination = path.join(...destination.split('/'));

    await fs.mkdir(destination, { recursive: true });

    const files = await fs.readdir(source, { withFileTypes: true });

    for (const file of files) {
        const sourcePath = path.join(source, file.name);
        const destinationPath = path.join(destination, file.name);

        if (file.isDirectory()) {
            await copyDirectoryAndContents(sourcePath, destinationPath);
        } else {
            await fs.copyFile(sourcePath, destinationPath);
        }
    }
};

export function removeVersion(res: string) {
    return res.replace(/(v[0-9.]+)/, 'vTest');
}
