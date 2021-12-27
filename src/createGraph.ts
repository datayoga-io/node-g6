import G6 from "@antv/g6";
import { IRenderOptions } from "src";
import { INodeStyleOptions } from "./interfaces";

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
const defaultNodeStyle: INodeStyleOptions = {
  fill: "#C6E5FF",
  stroke: "#5B8FF9",
  fontSize: 12,
  fontColor: "black",
  lineWidth: 1,
};

function configNodeTypes(options: { [type: string]: INodeStyleOptions }) {
  G6.registerNode(
    "node",
    {
      drawShape(cfg, group) {
        const type = (cfg.id as string).split(":")[0];
        const nodeStyle = Object.assign({}, defaultNodeStyle, options[type]);
        const rect = group.addShape("rect", {
          attrs: {
            x: (-1 * nodeWidth) / 2 - iconWidth / 2,
            y: (-1 * nodeHeight) / 2,
            width: nodeWidth,
            height: nodeHeight,
            radius: 10,
            stroke: nodeStyle.stroke,
            fill: nodeStyle.fill,
            lineWidth: 3,
          },
          name: "rect-shape",
        });

        if (cfg.id) {
          group.addShape("text", {
            attrs: {
              text: formatLabel(<string>cfg.id),
              x: 0,
              y: 0,
              fill: nodeStyle.fontColor,
              fontSize: nodeStyle.fontSize,
              textAlign: "center",
              textBaseline: "middle",
            },
            name: "text-shape",
          });
        }
        return rect;
      },
    },
    "rect"
  );
}

function createGraph(options: IRenderOptions, nodeTypes: string[]) {
  const nodeStyles = nodeTypes.map((type) => {
    return {
      id: type,
      label: type,
      type: "rect",
      style: Object.assign({}, defaultNodeStyle, options.nodes[type]),
    };
  });
  const legend = new G6.Legend({
    data: {
      nodes: nodeStyles,
    },
    containerStyle: {
      fill: "white",
      lineWidth: 0,
    },
  });
  configNodeTypes((options && options.nodes) || {});
  const graph = new G6.Graph({
    container: "container",
    width: 2000,
    height: 2000,
    layout: {
      type: "dagre",
      ranksep: 0,
      nodesep: nodeHeight,
      rankDir: "LR",
      controlPoints: true,
    },
    defaultNode: {
      type: "node",
      size: [nodeWidth, nodeHeight],
    },
    defaultEdge: {
      type: "polyline",
      style: {
        radius: 20,
        offset: 35,
        endArrow: true,
        lineWidth: 2,
        stroke: "#C2C8D5",
      },
    },
    plugins: [legend],
    fitView: false,
  });

  return {
    graph,
    legend,
  };
}

export { createGraph };
