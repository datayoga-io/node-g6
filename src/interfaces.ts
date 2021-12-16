export interface INodeStyleOptions {
  fill: string;
}
export interface IStyleOptions {
  width: number;
  height: number;
  nodes: { [type: string]: INodeStyleOptions };
}
export interface IRenderOptions {
  styles?: IStyleOptions;
}
