export interface INodeStyleOptions {
  fill?: string;
  stroke?: string;
  fontSize?: number;
  fontColor?: string;
  lineWidth?: number;
}
export interface IRenderOptions {
  nodes: { [type: string]: INodeStyleOptions };
}
