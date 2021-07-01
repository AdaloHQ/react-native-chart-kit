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
}

type PieChartState = {
  data: Array<any>;
  calculating: Array<any>;
};

class PieChart extends AbstractChart<PieChartProps, PieChartState> {
  componentDidUpdate(prevProps) {
    if (
      this.props.width !== prevProps.width ||
      this.props.chartWidthPercentage !== prevProps.chartWidthPercentage ||
      this.props.data != prevProps.data
    ) {
      let calculating = [];
      for (let i = 0; i < this.props.data.length; i++) {
        calculating[i] = { label: this.props.data[i], calculating: true };
      }

      this.setState({
        calculating,
        ...this.props
      });
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
      ...props
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

    const onLayout = (e, index, fontSize) => {
      let width = e.nativeEvent.layout.width;
      let target =
        this.props.width - this.props.width * chartWidthPercentage - 84;
      let calculating = this.state.calculating;

      console.log("width", width);

      if (width < target) {
        calculating[index].calculating = false;
        this.setState({
          calculating,
          ...this.state
        });
      } else {
        let label = calculating[index].label.name;
        if (label.slice(-3) === "...") {
          label = label.slice(0, -3);
        }
        target = target - fontSize.split("p")[0] * 2;
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
        return (
          <View
            key={index}
            style={{ alignSelf: "flex-start", position: "absolute" }}
            onLayout={e => onLayout(e, index, legendFontSize)}
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
            >
              {`${this.state.calculating[c.index].label.value} ${
                this.state.calculating[c.index].label.name
              }`}
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
