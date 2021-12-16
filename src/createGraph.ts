import G6 from "@antv/g6";
import path from "path";
import { INodeStyleOptions, IStyleOptions } from "./interfaces";
/**
 * fit a string to a given length and add elipsis
 * @param {string} str label
 * @param {number} maxWidth maximum width
 * @param {number} fontSize font size
 * @return {string} fitted string
 */
const fittingString = (str, maxWidth, fontSize) => {
  const fontWidth = fontSize * 1.2; // font factor
  maxWidth = maxWidth * 2;
  const width = str.length * fontWidth;
  const ellipsis = "…";
  if (width > maxWidth) {
    const actualLen = Math.floor((maxWidth - 10) / fontWidth);
    const result = str.substring(0, actualLen) + ellipsis;
    return result;
  }
  return str;
};
const formatLabel = (id: string) => {
  const type = id.split(":")[0];
  let object = id.split(":")[1];
  let module = "";
  let label = "";
  if (object.indexOf(".") > -1) {
    [module, object] = object.split(".");
    label = module + "\n";
  }
  label = label + fittingString(object, 150, 14);
  return label;
};
const nodeWidth = 150;
const nodeHeight = 30;
const iconHeight = 12;
const iconWidth = iconHeight;
function configNodeTypes(options: { [type: string]: INodeStyleOptions }) {
  const defaultNodeStyle: INodeStyleOptions = {
    fill: "#C6E5FF",
  };
  G6.registerNode(
    "node",
    {
      drawShape(cfg, group) {
        const nodeStyle = options[(cfg.id as string).split(".")[0]];
        // options[(cfg.id as string).split(".")[0]]
        const type = (cfg.id as string).split(":")[0];
        let fill = (nodeStyle && nodeStyle.fill) || defaultNodeStyle.fill;

        if (type == "pipeline") {
          fill = "lightgreen";
        } else if (type == "table") {
          fill = "lightgrey";
        }

        const rect = group.addShape("rect", {
          attrs: {
            x: (-1 * nodeWidth) / 2 - iconWidth / 2,
            y: (-1 * nodeHeight) / 2,
            width: nodeWidth,
            height: nodeHeight,
            radius: 10,
            stroke: "#5B8FF9",
            fill: fill,
            lineWidth: 3,
          },
          name: "rect-shape",
        });
        // const keyShape = group.addShape("image", {
        //   attrs: {
        //     x: (-1 * nodeWidth) / 2,
        //     y: -1 * nodeHeight,
        //     width: iconWidth,
        //     height: iconHeight,
        //     img:
        //       "file://" +
        //       path.join(__dirname, "icons/outline_settings_black_48dp.png"),

        //     // "http://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png",

        //     // fontFamily: "Material Icons",
        //     // textAlign: "center",
        //     // textBaseline: "middle",
        //     // text: "face3",
        //     // fill: "#00287E",
        //     // fontSize: 11,
        //   },
        //   // must be assigned in G6 3.3 and later versions. it can be any value you want
        //   name: `node-icon`,
        // });

        if (cfg.id) {
          group.addShape("text", {
            attrs: {
              text: formatLabel(<string>cfg.id),
              x: 0,
              y: 0,
              fill: "black",
              fontSize: 12,
              textAlign: "center",
              textBaseline: "middle",
            },
            name: "text-shape",
          });
        }
        return rect;
      },
    },
    "single-node"
  );
}
function createGraph(options: IStyleOptions) {
  configNodeTypes((options && options.nodes) || {});
  const graph = new G6.Graph({
    container: "container",
    width: (options && options.width) || 2000,
    height: (options && options.height) || 2000,
    layout: {
      type: "dagre",
      ranksep: 20,
      nodesep: nodeWidth / 2,
      rankDir: "LR",
      controlPoints: true,
    },
    defaultNode: {
      type: "node",
    },
    defaultEdge: {
      type: "polyline",
      style: {
        radius: 20,
        offset: 45,
        endArrow: true,
        lineWidth: 2,
        stroke: "#C2C8D5",
      },
    },
    fitView: false,
  });

  return graph;
}

export { createGraph };
