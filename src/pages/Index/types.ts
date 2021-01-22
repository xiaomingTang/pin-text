// image map 自动生成

type Coord = [number, number]

type Area = {
  type: "rect";
  /**
   * 左上角与右下角顶点坐标
   */
  path: [Coord, Coord];
} | {
  type: "circle";
  /**
   * 圆直径两端点坐标
   */
  path: [Coord, Coord];
} | {
  type: "polygon";
  /**
   * 多边形顶点坐标
   */
  path: Coord[];
}

type CompoAction = {
  type: "url" | "phone" | "anchor";
  trigger: "click";
  target: string;
  openInNewPage: boolean;
}

interface Config {
  background: {
    color: string;
    image: string;
    imageSize: {
      width: number;
      height: number;
    };
    /**
     * fill 拉伸至设备尺寸
     * contain 等比缩放到设备边缘
     * cover 等比缩放到填满设备, 超出则出现滚动条
     */
    fit: "fill" | "contain" | "cover";
  };
  title: string;
  description: string;
  components: {
    area: Area;
    action: CompoAction;
  }[];
}
