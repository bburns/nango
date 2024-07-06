import fs from 'fs';
import { glob } from 'glob';
import * as tsNode from 'ts-node';
import chalk from 'chalk';
import path from 'path';
import { build } from 'tsup';
import slash from 'slash';

import { getNangoRootPath, printDebug } from '../utils.js';
import { loadYamlAndGenerate } from './model.service.js';
import parserService from './parser.service.js';
import type { NangoYamlParsed, ScriptFileType, ScriptTypeLiteral } from '@nangohq/types';
import { getProviderConfigurationFromPath } from '@nangohq/nango-yaml';

const ALLOWED_IMPORTS = ['url', 'crypto', 'zod', 'node:url', 'node:crypto'];

export async function compileAllFiles({
    debug,
    fullPath,
    scriptName,
    providerConfigKey,
    type
}: {
    debug: boolean;
    fullPath: string;
    scriptName?: string;
    providerConfigKey?: string;
    type?: ScriptFileType;
}): Promise<boolean> {
    console.log('compileAllFiles', fullPath);

    const tsconfig = fs.readFileSync(path.join(getNangoRootPath(), 'tsconfig.dev.json'), 'utf8');
    console.log('tsconfig', tsconfig);

    const distDir = path.join(fullPath, 'dist');
    if (!fs.existsSync(distDir)) {
        if (debug) {
            printDebug(`Creating ${distDir} directory`);
        }
        fs.mkdirSync(distDir);
    }

    const res = loadYamlAndGenerate({ fullPath, debug });
    if (!res.success) {
        return false;
    }

    const parsed = res.response!;
    const compilerOptions = (JSON.parse(tsconfig) as { compilerOptions: Record<string, any> }).compilerOptions;
    if (debug) {
        printDebug(`Compiler options: ${JSON.stringify(compilerOptions, null, 2)}`);
    }

    const compiler = tsNode.create({
        skipProject: true, // when installed locally we don't want ts-node to pick up the package tsconfig.json file
        compilerOptions
    });

    let scriptDirectory: string | undefined;
    if (scriptName && providerConfigKey && type) {
        scriptDirectory = resolveTsFileLocation({ fullPath, scriptName, providerConfigKey, type }).replace(fullPath, '');
        console.log(chalk.green(`Compiling ${scriptName}.ts in ${fullPath}${scriptDirectory}`));
    }

    const integrationFiles = listFilesToCompile({ scriptName, fullPath, scriptDirectory, parsed, debug });
    console.log('integrationFiles', integrationFiles);

    let success = true;
    for (const file of integrationFiles) {
        try {
            const completed = await compile({ fullPath, file, parsed, compiler, debug });
            if (!completed) {
                if (scriptName && file.inputPath.includes(scriptName)) {
                    success = false;
                }
            }
        } catch (error) {
            console.log(chalk.red(`Error compiling "${file.inputPath}":`));
            console.error(error);
            success = false;
        }
    }

    return success;
}

export async function compileSingleFile({
    fullPath,
    file,
    parsed,
    tsconfig,
    debug = false
}: {
    fullPath: string;
    file: ListedFile;
    tsconfig: string;
    parsed: NangoYamlParsed;
    debug: boolean;
}) {
    try {
        const compiler = tsNode.create({
            skipProject: true, // when installed locally we don't want ts-node to pick up the package tsconfig.json file
            compilerOptions: JSON.parse(tsconfig).compilerOptions
        });

        const result = await compile({
            fullPath,
            file,
            parsed,
            compiler,
            debug
        });

        return result;
    } catch (error) {
        console.error(`Error compiling ${file.inputPath}:`);
        console.error(error);
        return false;
    }
}

function compileImportedFile({
    fullPath,
    filePath,
    compiler,
    parsed,
    type
}: {
    fullPath: string;
    filePath: string;
    compiler: tsNode.Service;
    parsed: NangoYamlParsed;
    type: ScriptTypeLiteral | undefined;
}): boolean {
    let finalResult = true;
    const importedFiles = parserService.getImportedFiles(filePath);

    if (!parserService.callsAreUsedCorrectly(filePath, type, Array.from(parsed.models.keys()))) {
        return false;
    }

    for (const importedFile of importedFiles) {
        const importedFilePath = path.resolve(path.dirname(filePath), importedFile);
        const importedFilePathWithoutExtension = path.join(path.dirname(importedFilePath), path.basename(importedFilePath, path.extname(importedFilePath)));
        const importedFilePathWithExtension = importedFilePathWithoutExtension + '.ts';

        /// if it is a library import then we can skip it
        if (!fs.existsSync(importedFilePathWithExtension)) {
            // if the library is not allowed then we should let the user know
            // that it is not allowed and won't work early on
            if (!ALLOWED_IMPORTS.includes(importedFile)) {
                console.log(chalk.red(`Importing libraries is not allowed. Please remove the import "${importedFile}" from "${path.basename(filePath)}"`));
                return false;
            }
            continue;
        }

        // if the file is not in the nango-integrations directory
        // then we should not compile it
        // if the parts of the path are shorter than the current that means it is higher
        // than the nango-integrations directory
        if (importedFilePathWithExtension.split(path.sep).length < fullPath.split(path.sep).length) {
            const importedFileName = path.basename(importedFilePathWithExtension);

            console.log(
                chalk.red(
                    `All imported files must live within the nango-integrations directory. Please move "${importedFileName}" into the nango-integrations directory.`
                )
            );
            return false;
        }

        if (importedFilePathWithExtension.includes('models.ts')) {
            continue;
        }

        console.log(`compile ${importedFilePathWithExtension} with ts-node`);
        compiler.compile(fs.readFileSync(importedFilePathWithExtension, 'utf8'), importedFilePathWithExtension);
        console.log(chalk.green(`Compiled "${importedFilePathWithExtension}" successfully`));

        finalResult = compileImportedFile({ fullPath, filePath: importedFilePathWithExtension, compiler, type, parsed });
    }

    return finalResult;
}

async function compile({
    fullPath,
    file,
    parsed,
    compiler,
    debug = false
}: {
    fullPath: string;
    file: ListedFile;
    parsed: NangoYamlParsed;
    compiler: tsNode.Service;
    debug: boolean;
}): Promise<boolean> {
    // console.log('compile', { fullPath, file });

    //. explain
    const providerConfiguration = getProviderConfigurationFromPath({ filePath: file.inputPath, parsed });
    if (!providerConfiguration) {
        return false;
    }

    //. explain
    const syncConfig = [...providerConfiguration.syncs, ...providerConfiguration.actions].find((sync) => sync.name === file.baseName);
    const type = syncConfig?.type || 'sync';

    //. compile any imported files
    const success = compileImportedFile({ fullPath, filePath: file.inputPath, compiler, type, parsed });
    if (!success) {
        return false;
    }

    // compile ts file with ts-node
    console.log(`compile ${file.inputPath} with ts-node...`);
    compiler.compile(fs.readFileSync(file.inputPath, 'utf8'), file.inputPath);

    // get output path, eg '/.../dist/emails-google-mail.js'
    const dirname = path.dirname(file.outputPath);
    const extname = path.extname(file.outputPath);
    const basename = path.basename(file.outputPath, extname);
    const fileNameWithExtension = `${basename}-${providerConfiguration.providerConfigKey}${extname}`;
    const outputPath = path.join(dirname, fileNameWithExtension);
    if (debug) {
        printDebug(`Compiling ${file.inputPath} -> ${outputPath}`);
    }

    // build with tsup
    console.log(`build ${file.inputPath} with tsup`);
    await build({
        entryPoints: [slash(file.inputPath)], // need posix paths
        tsconfig: path.join(getNangoRootPath(), 'tsconfig.dev.json'),
        skipNodeModulesBundle: true,
        silent: !debug,
        outDir: path.join(fullPath, 'dist'),
        outExtension: () => ({ js: '.js' }),
        onSuccess: async () => {
            console.log('onSuccess - file:', file);
            if (fs.existsSync(file.outputPath)) {
                await fs.promises.rename(file.outputPath, outputPath);
                console.log(chalk.green(`Compiled "${file.inputPath}" successfully`));
            } else {
                console.log(chalk.red(`Failed to compile "${file.inputPath}"`));
            }
            return;
        }
    });

    return true;
}

export interface ListedFile {
    inputPath: string;
    outputPath: string;
    baseName: string;
}

// fullPath -
// filePath - abs or relative platform path
// inputPath - absolute platform path
// outputPath - absolute platform path
export function getFileToCompile({ fullPath, filePath }: { fullPath: string; filePath: string }): ListedFile {
    const baseName = path.basename(filePath, '.ts');
    return {
        inputPath: filePath,
        outputPath: path.join(fullPath, `dist/${baseName}.js`),
        baseName
    };
}

export function resolveTsFileLocation({
    fullPath,
    scriptName,
    providerConfigKey,
    type
}: {
    fullPath: string;
    scriptName: string;
    providerConfigKey: string;
    type: ScriptFileType;
}) {
    const nestedPath = path.resolve(fullPath, `${providerConfigKey}/${type}/${scriptName}.ts`);
    if (fs.existsSync(nestedPath)) {
        return fs.realpathSync(path.resolve(nestedPath, '../'));
    }

    return fs.realpathSync(path.join(fullPath, './'));
}

export function listFilesToCompile({
    fullPath,
    scriptDirectory,
    scriptName,
    parsed,
    debug
}: {
    fullPath: string;
    scriptDirectory?: string | undefined;
    scriptName?: string | undefined;
    parsed: NangoYamlParsed;
    debug?: boolean;
}): ListedFile[] {
    let files: string[] = [];
    if (scriptName) {
        if (debug) {
            printDebug(`Compiling ${scriptName}.ts`);
        }

        files = [path.join(fullPath, scriptDirectory || '', `${scriptName}.ts`)];
    } else {
        files = getMatchingFiles(fullPath, 'ts');

        // models.ts is the one expected file
        if (files.length === 1 && debug) {
            printDebug(`No files found in the root: ${fullPath}`);
        }

        parsed.integrations.forEach((integration) => {
            const syncPath = `${integration.providerConfigKey}/syncs`;
            const actionPath = `${integration.providerConfigKey}/actions`;
            const postPath = `${integration.providerConfigKey}/post-connection-scripts`;

            const syncFiles = getMatchingFiles(fullPath, syncPath, 'ts');
            const actionFiles = getMatchingFiles(fullPath, actionPath, 'ts');
            const postFiles = getMatchingFiles(fullPath, postPath, 'ts');

            files = [...files, ...syncFiles, ...actionFiles, ...postFiles];
            console.log('files', files);

            if (debug) {
                if (syncFiles.length > 0) {
                    printDebug(`Found nested sync files in ${syncPath}`);
                }
                if (actionFiles.length > 0) {
                    printDebug(`Found nested action files in ${actionPath}`);
                }
                if (postFiles.length > 0) {
                    printDebug(`Found nested post connection script files in ${postPath}`);
                }
            }
        });
    }

    return files.map((filePath) => {
        return getFileToCompile({ fullPath, filePath });
    });
}

// get absolute platform file paths that match the given path parts,
// with last part treated as a file extension.
// eg getMatchingFiles('/foo', 'bar', 'ts') -> glob.sync('/foo/bar/*.ts')
// returns ['/foo/bar/baz.ts', '/foo/bar/pok.ts', ...]
function getMatchingFiles(...args: string[]): string[] {
    args.splice(-1, 1, `*.${args.slice(-1)[0]}`);
    // glob prefers posix paths as input
    const pattern = args.join('/'); // eg '/foo/bar/*.ts'
    return glob.sync(pattern, { absolute: true });
}
