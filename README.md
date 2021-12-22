# node-g6

This package allows to render flow charts and DAGs using server side rendering using the awesome [Antvis G6](https://github.com/antvis/G6) package

# Installing

```
npm install @datayoga-io/node-g6
```

# Using from command line

```
npx @datayoga-io/node-g6
```

or if you installed the module globally:

```
node-g6
```

## Options

```
node-g6 <data>

render data

Positionals:
  data  data file in json format                                        [string]

Options:
  --version  Show version number                                       [boolean]
  --options  options file in json format
  --out      output file                    [required] [default: "pipeline.png"]
  --help     Show help                                                 [boolean]
```

# Using as a module

```
import * as graph from "@datayoga-io/node-g6";
import * as fs from "fs";
const data = {
  "nodes": [
    {
      "id": "pipeline:a"
    },
    {
      "id": "store:hello"
    },
    {
      "id": "store:world"
    },
    {
      "id": "store:d"
    },
    {
      "id": "store:e"
    }
  ],
  "edges": [
    {
      "source": "pipeline:a",
      "target": "store:hello"
    },
    {
      "source": "pipeline:a",
      "target": "store:world"
    },
    {
      "source": "pipeline:a",
      "target": "store:d"
    },
    {
      "source": "pipeline:a",
      "target": "store:e"
    }
  ]
}

// render to binary
const dagBinary = await graph.render(data, {});
// write to file
fs.writeFileSync("out.png",dagBinary,"binary");
```
