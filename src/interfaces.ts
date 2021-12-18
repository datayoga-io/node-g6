export interface INodeStyleOptions {
  fill: string;
  stroke: string;
  fontSize: number;
  fontColor: string;
}
export interface IStyleOptions {
  width: number;
  height: number;
  nodes: { [type: string]: INodeStyleOptions };
}
export interface IRenderOptions {
  styles?: IStyleOptions;
}
