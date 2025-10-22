import { isObject } from "lodash";
import Pie from "paths-js/pie";
import React, { Fragment } from "react";
import { View, ViewStyle, Text as NativeText } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";

import AbstractChart, { AbstractChartProps } from "./AbstractChart";
import { hslToRgba } from "./Utils";

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
  showLabelPrefix: boolean;
  editor: boolean;
}

type PieChartState = {
  data: Array<any>;
  calculating: Array<any>;
};

const compareDataArrays = (a, b) => {
  //TODO: remove values field from a and b
  //TODO: get the sum of values to make sure percentages stay the same
  let sumA = a.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  let sumB = b.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  return (
    sumA === sumB &&
    a.length === b.length &&
    a.every((value, index) => {
      const aCopy = {
        ...value,
        values: null
      };
      const bCopy = {
        ...b[index],
        values: null
      };
      return JSON.stringify(aCopy) === JSON.stringify(bCopy);
    })
  );
};

class PieChart extends AbstractChart<PieChartProps, PieChartState> {
  componentDidUpdate(prevProps) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height ||
      this.props.chartWidthPercentage !== prevProps.chartWidthPercentage ||
      !compareDataArrays(this.props.data, prevProps.data)
    ) {
      let calculating = [];
      for (let i = 0; i < this.props.data.length; i++) {
        calculating[i] = { label: this.props.data[i], calculating: true };
      }
      if (
        this.state.calculating.filter(i => i.calculating === true).length ===
          0 &&
        this.props.width === prevProps.width &&
        compareDataArrays(this.props.data, prevProps.data)
      ) {
        this.setState({
          calculating,
          ...this.props,
          ...this.state
        });
      } else {
        this.setState({
          calculating,
          ...this.props
        });
      }
    }
  }

  constructor(props) {
    super(props);
    let calculating = [];
    for (let i = 0; i < this.props.data.length; i++) {
      calculating[i] = { label: this.props.data[i], calculating: true };
    }
    this.state = {
      calculating,
      ...props,
      labelData: this.props.data
    };
  }

  render() {
    console.error('CHARTS PieChart render')

    const {
      style = {},
      backgroundColor,
      absolute = false,
      hasLegend = true,
      avoidFalseZero = false
    } = this.props;

    const calculations = this.state.calculating.map((item, index) => {
      let {
        name,
        legendFontFamily,
        legendFontSize,
        legendFontWeight,
        value
      } = item.label;
      if (item.calculating && this.props.hasLegend) {
        if (this.props.absolute === false) {
          value = "55%";
        }
        if (this.props.showLabelPrefix === false) {
          value = "";
        }
        if (!isObject(value)) {
          return (
            <View
              key={index}
              style={{ alignSelf: "flex-start", position: "absolute" }}
            >
              <NativeText
                style={{
                  fontFamily: legendFontFamily,
                  fontSize: legendFontSize,
                  fontWeight: legendFontWeight,
                  color: "transparent"
                }}
              >{`${value} ${name}`}</NativeText>
            </View>
          );
        } else {
          return (
            <View
              key={index}
              style={{ alignSelf: "flex-start", position: "absolute" }}
            >
              <NativeText
                style={{
                  fontFamily: legendFontFamily,
                  fontSize: legendFontSize,
                  fontWeight: legendFontWeight,
                  color: "transparent"
                }}
              >
                {//@ts-ignore
                `${value.whole}% ${name}`}
              </NativeText>
            </View>
          );
        }
      }
    });

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
      data: this.state.data,
      accessor: x => {
        return x[this.props.accessor];
      }
    });

    const total = this.state.data.reduce((sum, item) => {
      if (isObject(item[this.props.accessor])) {
        return sum + item[this.props.accessor].whole;
      } else {
        return sum + item[this.props.accessor];
      }
    }, 0);

    let uppedIndices = [];

    if (!absolute) {
      const divisor = total / 100.0;
      let wholeTotal = 0;
      chart.curves.forEach((c, i) => {
        if (!isObject(c.item.values)) {
          const percentage = c.item[this.props.accessor] / divisor;
          const pieces = percentage.toString().split(".");
          let whole = parseInt(pieces[0]);
          let decimal = parseFloat("." + pieces[1]);
          if (isNaN(decimal)) {
            decimal = 0;
          }
          wholeTotal += whole;
          //had to create a new object here to use for percentages, chart wouldn't render when assigning the object to c.item[this.props.accessor]
          c.item.values = {
            index: i,
            whole,
            decimal
          };
        } else {
          wholeTotal += c.item.values.whole;
        }
      });

      const hamiltonDiff = 100 - wholeTotal;
      const sortedCurves = [...chart.curves].sort((a, b) =>
        a.item.values.decimal < b.item.values.decimal ? 1 : -1
      );
      for (let i = 0; i < hamiltonDiff; i++) {
        let uppedVal = sortedCurves[i].item.values.whole;
        sortedCurves.some(item => {
          if (item.item.values.whole === uppedVal) {
            uppedIndices.push(item.item.values.index);
            chart.curves[item.item.values.index].item.values.whole += 1;
            return true;
          }
        });
      }
    }

    let chartCurvesSorted = [...chart.curves].filter(
      item => item.item.otherSlice !== true
    );
    let otherSlice = [...chart.curves].find(
      item => item.item.otherSlice === true
    );

    if (!absolute) {
      chartCurvesSorted = chartCurvesSorted.sort((a, b) =>
        a.item.values.whole < b.item.values.whole ? 1 : -1
      );
    }

    if (otherSlice) {
      chartCurvesSorted.push(otherSlice);
    }

    const slices = chartCurvesSorted.map((c, i) => {
      let value: string;

      if (absolute) {
        if (this.props.showLabelPrefix) {
          value = c.item[this.props.accessor];
        } else {
          value = "";
        }
      } else {
        //calculate percentage using Hamilton's method
        if (total === 0) {
          value = 0 + "%";
        } else {
          const item = c.item.values;
          let percentage = item.whole;

          if (avoidFalseZero && item.whole === 0 && item.decimal !== 0) {
            value = "<1%";
          } else {
            value = percentage + "%";
          }
        }
      }

      let textColor = this.state.calculating[i]
        ? c.item.legendFontColor
        : "transparent";

      if (typeof c?.item?.color === "string" && c.item.color.includes('hsl')) {
        c.item.color = hslToRgba(c.item.color)
      }

      return (
        <G key={Math.random()}>
          <Path
            d={c.sector.path.print()}
            fill={c.item.color}
            // fill={textColor}
            onPress={c.item.action}
            //@ts-ignore
            onClick={c.item.action}
          />
          {hasLegend ? (
            <Rect
              width={16}
              height={16}
              fill={c.item.color}
              rx={Number(8)}
              ry={Number(8)}
              x={
                this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
                24
              }
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.state.data.length) * i +
                12
              }
              onPress={c.item.action}
              //@ts-ignore
              onClick={c.item.action}
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={textColor}
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              fontWeight={c.item.legendFontWeight}
              x={this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.state.data.length) * i +
                12 * 2
              }
              onPress={c.item.action}
              //@ts-ignore
              onClick={c.item.action}
            >
              {`${value} ${c.item.name}`}
            </Text>
          ) : null}
        </G>
      );
    });

    console.error('CHARTS PieChart this.props :', this.props)
    console.error('CHARTS PieChart chartWidthPercentage :', chartWidthPercentage)
    console.error('CHARTS PieChart this.props.chartConfig :', this.props.chartConfig)
    console.error('CHARTS PieChart this.props :', this.props)

    return (
      <View
        style={{
          width: this.props.width,
          height: this.props.height,
          padding: 0,
          ...style
        }}
      >
        <Svg
          width={this.props.width}
          height={this.props.height}
          style={{ paddingRight: 16 }}
        >
          <G>
            {this.renderDefs({
              width: this.props.width,
              height: this.props.height,
              ...this.props.chartConfig
            })}
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={Number(borderRadius)}
            ry={Number(borderRadius)}
            fill={backgroundColor}
          />
          <G
            x={
              (this.props.width * chartWidthPercentage) / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
            width={this.props.width}
          >
            {slices}
          </G>
        </Svg>
        {calculations}
      </View>
    );
  }
}

export default PieChart;
