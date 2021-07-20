import { TsBundler } from "./index";
import * as minimist from "minimist";

//
// Main program entry point.
//
async function main(): Promise<void> {

    const argv = minimist(process.argv.slice(2));

    const tsBundler = new TsBundler();
    await tsBundler.invoke({
        projectRoot: argv.root,
        projectPath: argv.project,
        outPath: argv.out,
    });
}

main()
    .catch(err => {
        console.error("An error occured.");
        console.error(err);
        process.exit(1);
    });
