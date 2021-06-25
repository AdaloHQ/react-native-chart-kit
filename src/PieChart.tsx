import Pie from "paths-js/pie";
import React from "react";
import { View, ViewStyle } from "react-native";
import { G, Path, Rect, Svg } from "react-native-svg";
import { Text } from "@visx/text";

import AbstractChart, { AbstractChartProps } from "./AbstractChart";

export interface PieChartProps extends AbstractChartProps {
  data: Array<any>;
  width: number;
  height: number;
  accessor: string;
  backgroundColor: string;
  paddingLeft: string;
  center?: Array<number>;
  absolute?: boolean;
  hasLegend?: boolean;
  style?: Partial<ViewStyle>;
  avoidFalseZero?: boolean;
  chartWidthPercentage: number;
}

type PieChartState = {};

class PieChart extends AbstractChart<PieChartProps, PieChartState> {
  render() {
    const {
      style = {},
      backgroundColor,
      absolute = false,
      hasLegend = true,
      avoidFalseZero = false
    } = this.props;

    const { borderRadius = 0 } = style;

    let chartWidthPercentage = this.props.chartWidthPercentage * 0.01;

    let radius: number;

    if (
      this.props.height / 2.5 <
      (this.props.width * chartWidthPercentage) / 2
    ) {
      radius = this.props.height / 2.5;
      chartWidthPercentage = 2 * (radius / this.props.width);
    } else {
      radius = this.props.width * (chartWidthPercentage / 2);
    }

    if (chartWidthPercentage === 1) {
      chartWidthPercentage = 0.5;
    }

    let chart = Pie({
      center: this.props.center || [0, 0],
      r: 0,
      R: radius,
      data: this.props.data,
      accessor: x => {
        return x[this.props.accessor];
      }
    });

    const total = this.props.data.reduce((sum, item) => {
      return sum + item[this.props.accessor];
    }, 0);

    let uppedIndices = [];

    if (!absolute) {
      const divisor = total / 100.0;
      let wholeTotal = 0;
      chart.curves.forEach((c, i) => {
        const percentage = c.item[this.props.accessor] / divisor;
        const pieces = percentage.toString().split(".");
        const whole = parseInt(pieces[0]);
        let decimal = parseFloat("." + pieces[1]);
        if (isNaN(decimal)) {
          decimal = 0;
        }
        wholeTotal += whole;
        c.item[this.props.accessor] = {
          index: i,
          whole,
          decimal
        };
      });

      const hamiltonDiff = 100 - wholeTotal;
      const sortedCurves = [...chart.curves].sort((a, b) =>
        a.item[this.props.accessor].decimal <
        b.item[this.props.accessor].decimal
          ? 1
          : -1
      );
      for (let i = 0; i < hamiltonDiff; i++) {
        uppedIndices.push(sortedCurves[i].item[this.props.accessor].index);
      }
    }

    const slices = chart.curves.map((c, i) => {
      let value: string;

      if (absolute) {
        value = c.item[this.props.accessor];
      } else {
        //calculate percentage using Hamilton's method
        if (total === 0) {
          value = 0 + "%";
        } else {
          const item = c.item[this.props.accessor];
          let percentage = item.whole;
          if (uppedIndices.includes(item.index)) {
            percentage += 1;
          }
          if (avoidFalseZero && item.whole === 0 && item.decimal !== 0) {
            value = "<1%";
          } else {
            value = percentage + "%";
          }
        }
      }
      return (
        <G key={Math.random()}>
          <Path
            d={c.sector.path.print()}
            fill={c.item.color}
            onPress={c.item.action}
          />
          {hasLegend ? (
            <Rect
              width={c.item.legendFontSize}
              height={c.item.legendFontSize}
              fill={c.item.color}
              rx={8}
              ry={8}
              x={
                this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
                24
              }
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              fontWeight={c.item.legendFontWeight}
              x={this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12 * 2
              }
              //uncomment to wrap text (poor implementation)
              // width={this.props.width / 2.5 - 16}
            >
              {`${value} ${c.item.name}`}
            </Text>
          ) : null}
        </G>
      );
    });

    return (
      <View
        style={{
          width: this.props.width,
          height: this.props.height,
          padding: 0,
          ...style
        }}
      >
        <Svg width={this.props.width} height={this.props.height}>
          <G>
            {this.renderDefs({
              width: this.props.height,
              height: this.props.height,
              ...this.props.chartConfig
            })}
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill={backgroundColor}
          />
          <G
            x={
              (this.props.width * chartWidthPercentage) / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
            // @ts-expect-error
            width={this.props.width}
          >
            {slices}
          </G>
        </Svg>
      </View>
    );
  }
}

export default PieChart;
