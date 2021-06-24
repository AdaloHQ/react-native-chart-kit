import { ViewStyle } from "react-native";
import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "./AbstractChart";
import { ChartData } from "./HelperTypes";
export interface BarChartProps extends AbstractChartProps {
  data: ChartData;
  width: number;
  height: number;
  fromZero?: boolean;
  withInnerLines?: boolean;
  yAxisLabel: string;
  yAxisSuffix: string;
  chartConfig: AbstractChartConfig;
  style?: Partial<ViewStyle>;
  horizontalLabelRotation?: number;
  verticalLabelRotation?: number;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  /**
   * The number of horizontal lines
   */
  segments?: number;
  showBarTops?: boolean;
  showValuesOnTopOfBars?: boolean;
  withCustomBarColorFromData?: boolean;
  flatColor?: boolean;
}
declare type BarChartState = {};
declare class BarChart extends AbstractChart<BarChartProps, BarChartState> {
  getBarPercentage: () => number;
  renderBars: ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    barRadius,
    withCustomBarColorFromData
  }: Pick<
    Pick<
      AbstractChartConfig,
      | "propsForBackgroundLines"
      | "propsForLabels"
      | "color"
      | "labelColor"
      | "propsForVerticalLabels"
      | "propsForHorizontalLabels"
      | "count"
      | "width"
      | "height"
      | "paddingTop"
      | "paddingRight"
      | "horizontalLabelRotation"
      | "formatYLabel"
      | "labels"
      | "horizontalOffset"
      | "stackedBar"
      | "verticalLabelRotation"
      | "formatXLabel"
      | "verticalLabelsHeightPercentage"
      | "backgroundColor"
      | "backgroundGradientFrom"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientTo"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
      | "useShadowColorFromDataset"
      | "strokeWidth"
      | "barPercentage"
      | "barRadius"
      | "propsForDots"
      | "decimalPlaces"
      | "style"
      | "linejoinType"
      | "scrollableDotFill"
      | "scrollableDotStrokeColor"
      | "scrollableDotStrokeWidth"
      | "scrollableDotRadius"
      | "scrollableInfoViewStyle"
      | "scrollableInfoTextStyle"
      | "scrollableInfoTextDecorator"
      | "scrollableInfoOffset"
      | "scrollableInfoSize"
    >,
    "width" | "height" | "paddingTop" | "paddingRight" | "barRadius"
  > & {
    data: number[];
    withCustomBarColorFromData: boolean;
  }) => JSX.Element[];
  renderBarTops: ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Pick<
      AbstractChartConfig,
      | "propsForBackgroundLines"
      | "propsForLabels"
      | "color"
      | "labelColor"
      | "propsForVerticalLabels"
      | "propsForHorizontalLabels"
      | "count"
      | "width"
      | "height"
      | "paddingTop"
      | "paddingRight"
      | "horizontalLabelRotation"
      | "formatYLabel"
      | "labels"
      | "horizontalOffset"
      | "stackedBar"
      | "verticalLabelRotation"
      | "formatXLabel"
      | "verticalLabelsHeightPercentage"
      | "backgroundColor"
      | "backgroundGradientFrom"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientTo"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
      | "useShadowColorFromDataset"
      | "strokeWidth"
      | "barPercentage"
      | "barRadius"
      | "propsForDots"
      | "decimalPlaces"
      | "style"
      | "linejoinType"
      | "scrollableDotFill"
      | "scrollableDotStrokeColor"
      | "scrollableDotStrokeWidth"
      | "scrollableDotRadius"
      | "scrollableInfoViewStyle"
      | "scrollableInfoTextStyle"
      | "scrollableInfoTextDecorator"
      | "scrollableInfoOffset"
      | "scrollableInfoSize"
    >,
    "width" | "height" | "paddingTop" | "paddingRight"
  > & {
    data: number[];
  }) => JSX.Element[];
  renderColors: ({
    data,
    flatColor
  }: Pick<AbstractChartConfig, "data"> & {
    flatColor: boolean;
  }) => JSX.Element[];
  renderValuesOnTopOfBars: ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Pick<
      AbstractChartConfig,
      | "propsForBackgroundLines"
      | "propsForLabels"
      | "color"
      | "labelColor"
      | "propsForVerticalLabels"
      | "propsForHorizontalLabels"
      | "count"
      | "width"
      | "height"
      | "paddingTop"
      | "paddingRight"
      | "horizontalLabelRotation"
      | "formatYLabel"
      | "labels"
      | "horizontalOffset"
      | "stackedBar"
      | "verticalLabelRotation"
      | "formatXLabel"
      | "verticalLabelsHeightPercentage"
      | "backgroundColor"
      | "backgroundGradientFrom"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientTo"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
      | "useShadowColorFromDataset"
      | "strokeWidth"
      | "barPercentage"
      | "barRadius"
      | "propsForDots"
      | "decimalPlaces"
      | "style"
      | "linejoinType"
      | "scrollableDotFill"
      | "scrollableDotStrokeColor"
      | "scrollableDotStrokeWidth"
      | "scrollableDotRadius"
      | "scrollableInfoViewStyle"
      | "scrollableInfoTextStyle"
      | "scrollableInfoTextDecorator"
      | "scrollableInfoOffset"
      | "scrollableInfoSize"
    >,
    "width" | "height" | "paddingTop" | "paddingRight"
  > & {
    data: number[];
  }) => JSX.Element[];
  render(): JSX.Element;
}
export default BarChart;
//# sourceMappingURL=BarChart.d.ts.map
