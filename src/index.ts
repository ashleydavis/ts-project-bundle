import { copy, copyFile, ensureDir, readFile } from "fs-extra";
import * as path from "path";
import * as JSON5 from "json5";

//
// Arguments to the bundler.
//
export  interface ITsBundlerArgs {

    //
    // The root of the project containing the project to be bundled and its dependencies.
    //
    projectRoot: string;

    //
    // Path to the project to be bundled.
    //
    projectPath: string;

    //
    // The path to write bundled output.
    //
    outPath: string;
}


//
// API for the Tsbundler.
//
export class TsBundler {

    //
    // Loads a tsconfig file from a particular project.
    //
    private async loadTsConfig(projectPath: string): Promise<any> {
        return JSON5.parse(await readFile(path.join(projectPath, "tsconfig.json"), "utf8"));
    }
    
    //
    // Main function for the TsBundler api.
    //
    async invoke(args: ITsBundlerArgs): Promise<void> {
        console.log(`Bundling project from: ${args.projectPath} to ${args.outPath}.`);

        const mainTsConfig = await this.loadTsConfig(args.projectPath);

        const references = mainTsConfig.references || [];

        const relativeMainProjectPath = path.relative(args.projectPath, args.projectRoot);
        const outMainPath = path.resolve(path.join(args.outPath, relativeMainProjectPath));
        await ensureDir(outMainPath);

        for (const reference of references) {
            const relativeLibraryPath = reference.path;
            const fullLibraryPath = path.resolve(path.join(args.projectPath, relativeLibraryPath));
            const libraryTsConfig = await this.loadTsConfig(fullLibraryPath);

            // Copy the compiled library package to the output directory.
            await this.copyCompiledPackaged(outMainPath, relativeLibraryPath, fullLibraryPath, libraryTsConfig);
        }

        // Copy the compiled main package to the output directory.
        await this.copyCompiledPackaged(outMainPath, "./", args.projectPath, mainTsConfig);
    }

    //
    // Copies a compiled TypeScript package to the output directory.
    //
    private async copyCompiledPackaged(outMainPath: string, relativePackagePath: any, fullPackagePath: string, packageTsConfig: any): Promise<void> {
        const fullOutPath = path.resolve(path.join(outMainPath, relativePackagePath));
        await ensureDir(fullOutPath);

        await copyFile(path.join(fullPackagePath, "package.json"), path.join(fullOutPath, "package.json"));
        await copyFile(path.join(fullPackagePath, "package-lock.json"), path.join(fullOutPath, "package-lock.json"));

        const fullDistPath = path.join(fullPackagePath, packageTsConfig.compilerOptions.outDir);
        const fullOutDistPath = path.join(fullOutPath, packageTsConfig.compilerOptions.outDir);
        await copy(fullDistPath, fullOutDistPath);
    }
}


