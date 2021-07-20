# ts-project-bundle

A simple bundler for TypeScript projects using [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html).

This is a prototype! Please create an issue to give feedback.

Please see my other repo for some [examples of TypeScript projects that demonstrate project references](https://github.com/ashleydavis/sharing-typescript-code-libraries).

## Run it on your project

First install it:

```bash
npm install -g ts-project-bundle
```

Now navigate to your TypeScript project that uses [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html):

```bash
cd project-root/main-project
```

First compile your project and it's dependencies:

```bash
npx tsc --build
```

Note the use of the --build argument. This causes dependent projects to be built as well.

Now run `ts-project-bundler` against your main project:

```bash
ts-project-bundler --root=../ --project=./ --out=bundle
```

The root directory we are using is the parent directory of the main project. The root directory should contain the main project and all the libraries that the main project references.

The project directory is the main project directory. It is expected that this directory contains a `tsconfig.json` file that can be parsed to determine the referenced library projects.

The output directory is where to bundle the output. `ts-project-bundle` will copy the compiled main project and the compiled libraries to the output directory.

**! Sorry this is a prototype and there's no graceful error handling yet. Please make sure your inputs are sane :-)**

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