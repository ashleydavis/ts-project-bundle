import { findCommonRoot } from "../lib/lca";

describe("least common ancestor", () => {

    it("1", ()  => {
        expect(findCommonRoot(["/a"])).toEqual("/a");
    });

    it("2", ()  => {
        expect(findCommonRoot(["/x/a", "/x/b"])).toEqual("/x");
    });

    it("3", ()  => {
        expect(findCommonRoot(["/x/a", "/x/b/c"])).toEqual("/x");
    });

    it("4", ()  => {
        expect(findCommonRoot(["/x/y/a", "/x/y/b"])).toEqual("/x/y");
    });

    it("5", ()  => {
        expect(findCommonRoot(["c:/x/a", "c:/x/b"])).toEqual("c:/x");
    });

    it("6", ()  => {
        expect(findCommonRoot(["/x/y/a", "/x/y/b"])).toEqual("/x/y");
    });

    it("7", ()  => {
        expect(findCommonRoot(["c:/x/y/a", "c:/x/y/b"])).toEqual("c:/x/y");
    });

    it("8", ()  => {
        expect(findCommonRoot(["c:/x/y/a", "c:/x/y/b/c"])).toEqual("c:/x/y");
    });
});
