type CompoDataMap = {
  link: {
    url: {
      openInNewPage: boolean;
      target: string;
    };
    phone: {
      target: string;
    };
    anchor: {
      target: string;
    };
  };
  area: {
    rect: {
      /**
       * 左上角与右下角顶点坐标
       */
      path: [Coord, Coord];
    };
    circle: {
      /**
       * 圆直径两端点坐标
       */
      path: [Coord, Coord];
    };
    polygon: {
      /**
       * 多边形顶点坐标
       */
      path: Coord[];
    };
  };
}

interface Size {
  width: number;
  height: number;
}

/**
 * fill 拉伸至设备尺寸
 * contain 等比缩放到设备边缘
 * cover 等比缩放到填满设备, 超出则出现滚动条
 */
type Fit = "fill" | "contain" | "cover"

type Coord = [number, number]

type CompoAction = {
  action: "click";
}

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

type Compo = {
  type: "area";
  data: Area;
} | {
  type: "link";
  data: {

  };
}

interface Config {
  background: {
    color: string;
    image: string;
    imageSize: Size;
    fit: Fit;
  };
  title: string;
  description: string;
  components: Compo[];
}
