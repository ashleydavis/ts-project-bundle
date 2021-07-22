import { copy, copyFile, ensureDir, pathExists, readFile } from "fs-extra";
import * as path from "path";
import * as JSON5 from "json5";
import { findCommonRoot } from "./lib/lca";

//
// Arguments to the bundler.
//
export  interface ITsBundlerArgs {

    //
    // The root of the project containing the project to be bundled and its dependencies.
    //
    projectRoot?: string;

    //
    // Path to the project to be bundled.
    //
    projectPath?: string;

    //
    // The path to write bundled output.
    //
    outPath?: string;
}


//
// API for the Tsbundler.
//
export class TsBundler {

    //
    // Loads a tsconfig file from a particular project.
    //
    private async loadTsConfig(projectPath: string): Promise<any> {
        const tsConfigFilePath = path.join(projectPath, "tsconfig.json");
        const tsConfigExists = await pathExists(tsConfigFilePath);
        if (!tsConfigExists) {
            throw new Error(`Can't find tsconfig.json for project in ${projectPath}, are sure this is a TypeScript project?`);
        }
        return JSON5.parse(await readFile(tsConfigFilePath, "utf8"));
    }
    
    //
    // Main function for the TsBundler api.
    //
    async invoke(args: ITsBundlerArgs): Promise<void> {

        const projectPath = path.resolve(args.projectPath || "./");
        const outputPath = path.resolve(args.outPath || "./out");
        console.log(`Bundling project from: ${projectPath} to ${outputPath}.`);

        const mainTsConfig = await this.loadTsConfig(projectPath); // Loads the main project's tsconfig.
        const references = mainTsConfig.references || [];
        const referencedProjectRelativePaths = references.map((reference: any) => reference.path);

        let rootPath: string;
        if (args.projectRoot) {
            // Project root is specified.
            rootPath = path.resolve(args.projectRoot);
        }
        else {
            // Automatically determine project root.
            const referencedProjectPaths = referencedProjectRelativePaths.map((relativePath: string) => path.resolve(path.join(projectPath, relativePath)));
            const allProjectPaths = [projectPath].concat(referencedProjectPaths);
            rootPath = findCommonRoot(allProjectPaths);
            console.log("Automatically detected project root: " + rootPath);
        }

        const relativeMainProjectPath = path.relative(rootPath, projectPath);
        const outMainPath = path.resolve(path.join(outputPath, relativeMainProjectPath));
        await ensureDir(outMainPath);

        for (const relativeLibraryPath of referencedProjectRelativePaths) {
            const fullLibraryPath = path.resolve(path.join(projectPath, relativeLibraryPath));
            const libraryTsConfig = await this.loadTsConfig(fullLibraryPath); // Loads the tsconfig for the library.

            // Copy the compiled library package to the output directory.
            await this.copyCompiledPackaged(outMainPath, relativeLibraryPath, fullLibraryPath, libraryTsConfig);
        }

        // Copy the compiled main package to the output directory.
        await this.copyCompiledPackaged(outMainPath, "./", projectPath, mainTsConfig);
    }

    //
    // Copies a file.
    //
    private async copyFile(from: string, to: string): Promise<void> {
        console.log(`cp ${from} ${to}`);
        await copyFile(from, to);        
    }

    //
    // Copies a directory.
    //
    private async copyDir(from: string, to: string): Promise<void> {
        console.log(`cp -r ${from} ${to}`);
        await copy(from, to);   
    }

    //
    // Copies a compiled TypeScript package to the output directory.
    //
    private async copyCompiledPackaged(outMainPath: string, relativePackagePath: any, fullPackagePath: string, packageTsConfig: any): Promise<void> {
        const fullOutPath = path.resolve(path.join(outMainPath, relativePackagePath));
        await ensureDir(fullOutPath);

        await this.copyFile(path.join(fullPackagePath, "package.json"), path.join(fullOutPath, "package.json"));
        await this.copyFile(path.join(fullPackagePath, "package-lock.json"), path.join(fullOutPath, "package-lock.json"));

        const fullDistPath = path.join(fullPackagePath, packageTsConfig.compilerOptions.outDir);
        const fullOutDistPath = path.join(fullOutPath, packageTsConfig.compilerOptions.outDir);
        await this.copyDir(fullDistPath, fullOutDistPath);
    }
}


