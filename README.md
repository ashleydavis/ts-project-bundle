# ts-project-bundle

A simple bundler for TypeScript projects using [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html).

This is a prototype! Please create an issue to give feedback.

Please see my other repo for some [examples of TypeScript projects that demonstrate project references](https://github.com/ashleydavis/sharing-typescript-code-libraries).

If you like this project, please star this repo and [support my work](https://www.codecapers.com.au/about#support-my-work)

## Run it on your project

Open a terminal and navigate to your main TypeScript project:

```bash
cd project-root/main-project
```

Your main project must use [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to specify how it depends on shared TypeScript libraries.

First compile your project and it's dependencies:

```bash
npx tsc --build
```

Note the use of the `--build` argument. This causes dependent projects to be built as well.

Now install `ts-project-bundle` into your main project as a dev dependency:

```bash
npm install --save-dev ts-project-bundle
```

Now run `ts-project-bundle` against your main project:

```bash
ts-project-bundle
```

`ts-project-bundle` automatically uses the current working directory as the main project. You can also specify the project directory with the `--project=<dir>` parameter.

`ts-project-bundle` automatically detects referenced TypeScript libraries and the root path that contains both the main project and all the referenced libraries. The root path is required because it is required to reconstitute the directories for the main project and the library projects in the bundle. You can override the automatic root directory using the `--root=<dir>` argument, use with care.

The main project directory and all library directories must be valid TypeScript projects and must each contains a `tsconfig.json` file.

`ts-project-bundle` automatically defaults the output directory for the bundle to `./out` under the project directory. You can set this specifically using the `--out=<dir>` argument.

## Example

Here's how you might want to run this for a monorepo that contains microservices.

Directory structure:

```bash
some/path/my-application
    microservices/              # Each subdirectory contains a TypeScript microservice.
        microserviceA/
        microserviceB/
    libs/                       # Each subdirectory contains a shared TypeScript library.
        libA/
        libB/
```

Here's how we can bundle the code for `microserviceA`.

```bash
cd some/path/my-application/microservices/microserviceA
npx tsc --build     # Compiles the microservice and all references libraries.
ts-project-bundler  # Bundles combined code for microservice and libraries in the .out directory.
```

## Build the test project

Clone this repo and then...

```bash
cd ts-project-bundle/test/test-project
npm install 
npx tsc --build
ts-project-bundle --root=../ --project=./ --out=../../out
```

## Running it in development

Clone this repo and then...

```bash
cd ts-project-bundle
npm install
npm run start:dev
```
