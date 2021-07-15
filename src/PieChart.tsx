import { isObject } from "lodash";
import Pie from "paths-js/pie";
import React, { Fragment } from "react";
import { View, ViewStyle, Text as NativeText } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";

import AbstractChart, { AbstractChartProps } from "./AbstractChart";
// import TextWidthFinder from "./TextWidthFinder";

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
  onLayout: boolean;
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
        !this.props.editor &&
        compareDataArrays(this.props.data, prevProps.data)
      ) {
        this.setState({
          calculating,
          onLayout: false,
          ...this.props,
          ...this.state
        });
      } else {
        this.setState({
          calculating,
          onLayout: true,
          ...this.props
          // ...this.state
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
      onLayout: true,
      ...props,
      labelData: this.props.data
    };
  }

  render() {
    const {
      style = {},
      backgroundColor,
      absolute = false,
      hasLegend = true,
      avoidFalseZero = false
    } = this.props;

    const onLayout = (e, index, fontSize, label) => {
      if (this.state.onLayout) {
        let width = e.nativeEvent.layout.width;
        let target =
          this.props.width - this.props.width * chartWidthPercentage - 84;
        let calculating = this.state.calculating;

        if (width < target) {
          calculating[index].calculating = false;
          this.setState({
            calculating,
            ...this.state
          });
        } else {
          if (label.slice(-3) === "...") {
            label = label.slice(0, -3);
          }
          if (isNaN(fontSize)) {
            if (!fontSize) {
              fontSize = "12px";
            }
            target = target - fontSize.split("p")[0] * 2;
          } else {
            target = target - fontSize * 2;
          }
          const numberOfCharacters = label.length;
          const ratio = target / width;
          const targetCharacters = Math.floor(ratio * numberOfCharacters);
          label = `${label.slice(0, targetCharacters)}...`;
          calculating[index].label.name = label;
          if (label === "...") {
            calculating[index].calculating = false;
          }
          this.setState({
            calculating,
            ...this.state
          });
        }
      }
    };

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
              onLayout={e => onLayout(e, index, legendFontSize, name)}
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
              onLayout={e => onLayout(e, index, legendFontSize, name)}
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
        uppedIndices.push(sortedCurves[i].item.values.index);
      }
    }

    if (!absolute) {
      chart.curves = chart.curves.sort(
        (a, b) => a.item.values.whole > b.item.values.whole
      );
    }

    const slices = chart.curves.map((c, i) => {
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

      let textColor = this.state.calculating[i]
        ? c.item.legendFontColor
        : "transparent";

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
              rx={8}
              ry={8}
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
        {calculations}
      </View>
    );
  }
}

export default PieChart;
