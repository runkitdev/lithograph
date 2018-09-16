const main = require("../main");
const { List } = require("immutable");

const glob = require("fast-glob");
const { Repeat, Seq } = require("immutable");

const toJUnitXML = require("../to-junit-xml");

const { resolve } = require("path");
const moment = require("moment");

const options = require("commander")
    .version(require("../package").version)
    .option("-c, --concurrency [concurrency]",
        "Max number of test files running at the same time (Default: CPU cores)",
        require("os").cpus().length)
    .option("-o, --output [output]",
        "")
    .option("--no-headless")
    .option("--browser-logs")
    .option("-r, --require [path]",
        "A package to automatically require in the test environment.",
        (v, m) => (m.push(v), m), [])
    .parse(process.argv);

const patterns = options.args.length <= 0 ? ["**/*.test.md"] : options.args;

(async function ()
{
    const paths = Array.from(new Set(
        [].concat(...patterns.map(pattern => glob.sync(pattern)))))
        .map(path => resolve(path));

    options.requires = options.require.map(path => resolve(path));

    await main(paths, options);
/*
    const title = `${moment().format("YYYY-MM-DD-HH.mm.ss")}`;
    const root = Node({ title, children });

    options.output = options.output || `/tmp/lithograph-results/${title}`;
    options.metadata = options.output;
    options.requires = options.require.map(path => resolve(path));

    const start = Date.now();
    const [_, states] = await run(root, options);
    const duration = Date.now() - start;

    console.log("writing file...");
    toJUnitXML(`${options.output}/junit.xml`, root, states);

    const keyPaths = Seq(states.keys()).toList()
        .sort((lhs, rhs) => lhs
            .zipWith((lhs, rhs) => lhs === rhs ? 0 : lhs - rhs, rhs)
            .find(comparison => comparison !== 0) ||
            lhs.size - rhs.size);

    console.log("Total Time: " + duration + "ms");

    for (const keyPath of keyPaths)
    {
        if (keyPath.size === 0)
            continue;

        const node = root.getIn(keyPath);
        const state = states.get(keyPath);
        const prefix = Repeat(" ", keyPath.size).join("");
        const duration = state.duration > -1 ? `(${state.duration}ms)` : ""
        const skipped = state.aggregate === 5;
        const emoji =
            state.aggregate === 5 ? "-" :
            state.aggregate === 3 ? "✓" : "✕";
        const post = skipped ? "(skipped)" : duration;

        console.log(`${prefix}${emoji} ${node.title} ${post}`);
    }

    if (states.get(List()).aggregate === 2)
        process.exit(1);*/
})();
