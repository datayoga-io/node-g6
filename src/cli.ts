#!/usr/bin/env node
import * as graph from "./index";
import yargs from "yargs";
import * as fs from "fs";
async function render(argv) {
  const options =
    (argv["options"] &&
      JSON.parse(fs.readFileSync(argv["options"], "utf-8"))) ||
    {};
  const data = JSON.parse(fs.readFileSync(argv["data"], "utf-8"));
  const binaryData = await graph.render(data, options);
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
  .option("options", {
    description: "options file in json format",
  })
  .option("out", {
    alias: "o",
    description: "output file",
    default: "pipeline.png",
  })
  .demandOption(["out"])
  .help().argv;
