#!/usr/bin/env node
import * as graph from "./index";
import yargs from "yargs";
import * as fs from "fs";
async function render(argv) {
  const data = JSON.parse(fs.readFileSync(argv["data"], "utf-8"));
  const binaryData = await graph.render(data, {});
  fs.writeFileSync(argv.out, binaryData, "binary");
}
yargs
  .command({
    command: "$0 <data>",
    describe: "render data",
    handler: async (argv: any) => {
      render(argv);
    },
  })
  .positional("data", {
    required: true,
    describe: "data file in json format",
    type: "string",
  })
  .option("out", {
    description: "output file",
    default: "pipeline.png",
  })
  .demandOption(["out"])
  .help().argv;
