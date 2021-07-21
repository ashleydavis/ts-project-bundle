//
// A simple implemetation of the "least common ancestor" algorithm.
// This code finds the lowest shared root directory between multiple subdirectories.
//

//
// Splits a path string into components.
//
function splitPath(path: string): string[] {
    return path.replace(/\\/g, "/") // Normalize slashes.
        .split("/") // Split.
        .filter(part => part.length > 0);
}

//
// Splits a directory add adds each componet to the directory tree.
//
function addNodes(tree: any, dir: string): any {
    const dirParts = splitPath(dir);
    let working = tree;
    let partial = "";
    for (const part of dirParts) {
        if (part.endsWith(":")) {
            partial += part;
        }
        else {
            partial += "/" + part;
        }
        if (!working[part]) {
            working[part] = { _c: 0, _id: partial };
        }

        working = working[part];
        working._c += 1;
    }

    return working;
}

//
// Visits each node in the tree to find the least common ancestor.
//
function visit(node: any, searchCount: number): any {
    if (node._c !== undefined) {
        if (node._c !== searchCount) {
            return undefined;
        }
    }

    for (const [name, child] of Object.entries(node)) {
        if (name === "_c" || name === "_id") {
            continue;
        }

        const lca = visit(child, searchCount);
        if (lca !== undefined) {
            return lca;
        }
    }

    return node;
}

//
// Find the common root directory between directories.
// Inputs should be absolute dirs.
//
export function findCommonRoot(dirs: string[]): string { 

    const tree = {};
    const leafNodes = [];

    for (const dir of dirs) {
        leafNodes.push(addNodes(tree, dir));
    }

    // console.log(`Tree:`);
    // console.log(JSON.stringify(tree, null, 4));

    const lca = visit(tree, dirs.length);
    return lca._id;
}
