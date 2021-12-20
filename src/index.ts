import { Graph } from "@antv/g6";
import { createGraph } from "./createGraph";
import { IRenderOptions, IStyleOptions } from "./interfaces";

/**
 * render the graph in data to a binary buffer
 * @param {object} object data
 * @param {IRenderOptions}  IRenderOptions options to use for rendering
 * @return {Promise<string>} Promise<string> string containing image buffer
 */
export { IRenderOptions, IStyleOptions };
export async function render(data, options: IRenderOptions): Promise<string> {
  //
  // create virtual dom
  //
  const jsdom_global = require("jsdom-global");
  const defaultStyle: IStyleOptions = {
    width: 500,
    height: 750,
    nodes: {},
  };

  const dom = jsdom_global(
    `<!DOCTYPE html><body><div id="container"></div></body>`,
    { resources: "usable" }
  );

  const graph = createGraph(options.styles);
  graph.data(data);

  graph.render();
  return new Promise((resolve, reject) => {
    //
    // wait for rendering
    //
    graph.on("afterrender", () => {
      //
      // in case of images, we need to wait for the virtual DOM to complete rendering
      //
      if (document.readyState == "complete") {
        exportImage(graph, options?.styles, defaultStyle).then((binaryData) =>
          resolve(binaryData)
        );
      }

      document.addEventListener("readystatechange", (event) => {
        // check for complete state
        if (document.readyState == "complete") {
          //
          // export to base64 binary
          //
          exportImage(graph, options?.styles, defaultStyle).then((binaryData) =>
            resolve(binaryData)
          );
        }
      });
    });
  });
}
async function exportImage(
  graph: Graph,
  styles: IStyleOptions,
  defaultStyle
): Promise<string> {
  //
  // export to base64 binary
  //
  const bbox = graph.get("group").getCanvasBBox();
  const height = bbox.height;
  const width = bbox.width;
  let padding = [
    (styles?.height || defaultStyle.height - height) / 2,
    (styles?.width || defaultStyle.width - width) / 2,
    (styles?.height || defaultStyle.height - height) / 2,
    (styles?.width || defaultStyle.width - width) / 2,
  ];
  // if the image is larger than the requested size, we don't pad
  if (padding.some((pad) => pad < 0)) {
    padding = [0, 0, 0, 0];
  }
  return new Promise((resolve, reject) => {
    graph.toFullDataURL(
      (binContent) => {
        let base64Data = binContent.replace(/^data:image\/png;base64,/, "");
        base64Data += base64Data.replace("+", " ");
        let binaryData = Buffer.from(base64Data, "base64").toString("binary");
        resolve(binaryData);
      },
      null,
      { padding: padding }
    );
  });
}
