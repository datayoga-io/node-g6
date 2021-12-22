import { Graph, Legend } from "@antv/g6";
import { createGraph } from "./createGraph";
import { IRenderOptions } from "./interfaces";

/**
 * render the graph in data to a binary buffer
 * @param {object} object data
 * @param {IRenderOptions}  IRenderOptions options to use for rendering
 * @return {Promise<string>} Promise<string> string containing image buffer
 */
export { IRenderOptions };
export async function render(data, options?: IRenderOptions): Promise<string> {
  //
  // create virtual dom
  //
  const jsdom_global = require("jsdom-global");
  const defaultStyle: IRenderOptions = {
    nodes: {},
  };

  const dom = jsdom_global(
    `<!DOCTYPE html><body><div id="container"></div></body>`,
    { resources: "usable" }
  );
  // get unique node types
  const uniqueNodeTypes = new Set<string>(
    data.nodes.map((node) => node.id.split(":")[0])
  );
  const { graph, legend } = createGraph(options || defaultStyle, [
    ...uniqueNodeTypes,
  ]);
  global.legend = legend;
  graph.data(data);

  graph.render();
  return new Promise((resolve, reject) => {
    //
    // wait for rendering
    //
    graph.on("afterrender", () => {
      // we resize to fit the size of the actual graph, applying minimum width if needed
      const padding = 10;
      // make sure there is padding for the legend
      graph.moveTo(10, 60);
      const bbox = graph.get("group").getCanvasBBox();
      graph.changeSize(bbox.maxX + padding, bbox.maxY + padding);
      //
      // in case of images, we need to wait for the virtual DOM to complete rendering
      //
      if (document.readyState == "complete") {
        exportImage(graph, legend, options, defaultStyle).then((binaryData) => {
          document.body.innerHTML = "";
          window.close();
          window = null;
          // gc();
          resolve(binaryData);
        });
      }

      document.addEventListener("readystatechange", (event) => {
        // check for complete state
        if (document.readyState == "complete") {
          //
          // export to base64 binary
          //
          exportImage(graph, legend, options, defaultStyle).then(
            (binaryData) => {
              // shut down jsdom to free up memory
              document.body.innerHTML = "";
              window.close();
              window = null;
              // gc();
              resolve(binaryData);
            }
          );
        }
      });
    });
  });
}
async function exportImage(
  graph: Graph,
  legend: any,
  styles: IRenderOptions,
  defaultStyle
): Promise<string> {
  //
  // export to base64 binary
  //
  return new Promise((resolve, reject) => {
    // setTimeout is also used as a hack to get around timing issues.
    // G6 itself uses this when exporting an image...
    setTimeout(() => {
      // draw the legend on top of the original canvas. somewhat of a hack to get both canvases to download together

      const graphCanvas = graph.get("canvas");
      const legendCanvas = legend.get("legendCanvas");
      graphCanvas.cfg.context.drawImage(
        legendCanvas.cfg.context.canvas,
        10,
        10
      );

      const binContent = graph.get("canvas").cfg.context.canvas.toDataURL(
        "image/png",
        (err, binContent) => {
          let base64Data = binContent.replace(/^data:image\/png;base64,/, "");
          base64Data += base64Data.replace("+", " ");
          let binaryData = Buffer.from(base64Data, "base64").toString("binary");
          resolve(binaryData);
        }
        // null,
        // { padding: padding }
      );
    }, 16);
  });
}
