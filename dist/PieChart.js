var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import { isObject } from "lodash";
import Pie from "paths-js/pie";
import React from "react";
import { View, Text as NativeText } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var compareDataArrays = function(a, b) {
  //TODO: remove values field from a and b
  //TODO: get the sum of values to make sure percentages stay the same
  var sumA = a.reduce(function(accumulator, item) {
    return accumulator + item.value;
  }, 0);
  var sumB = b.reduce(function(accumulator, item) {
    return accumulator + item.value;
  }, 0);
  return (
    sumA === sumB &&
    a.length === b.length &&
    a.every(function(value, index) {
      var aCopy = __assign(__assign({}, value), { values: null });
      var bCopy = __assign(__assign({}, b[index]), { values: null });
      return JSON.stringify(aCopy) === JSON.stringify(bCopy);
    })
  );
};
var PieChart = /** @class */ (function(_super) {
  __extends(PieChart, _super);
  function PieChart(props) {
    var _this = _super.call(this, props) || this;
    var calculating = [];
    for (var i = 0; i < _this.props.data.length; i++) {
      calculating[i] = { label: _this.props.data[i], calculating: true };
    }
    _this.state = __assign(
      __assign({ calculating: calculating, onLayout: true }, props),
      { labelData: _this.props.data }
    );
    return _this;
  }
  PieChart.prototype.componentDidUpdate = function(prevProps) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height ||
      this.props.chartWidthPercentage !== prevProps.chartWidthPercentage ||
      !compareDataArrays(this.props.data, prevProps.data)
    ) {
      var calculating = [];
      for (var i = 0; i < this.props.data.length; i++) {
        calculating[i] = { label: this.props.data[i], calculating: true };
      }
      if (
        this.state.calculating.filter(function(i) {
          return i.calculating === true;
        }).length === 0 &&
        this.props.width === prevProps.width &&
        !this.props.editor &&
        compareDataArrays(this.props.data, prevProps.data)
      ) {
        this.setState(
          __assign(
            __assign({ calculating: calculating, onLayout: false }, this.props),
            this.state
          )
        );
      } else {
        this.setState(
          __assign(
            { calculating: calculating, onLayout: true },
            this.props
            // ...this.state
          )
        );
      }
    }
  };
  PieChart.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      _b = _a.style,
      style = _b === void 0 ? {} : _b,
      backgroundColor = _a.backgroundColor,
      _c = _a.absolute,
      absolute = _c === void 0 ? false : _c,
      _d = _a.hasLegend,
      hasLegend = _d === void 0 ? true : _d,
      _e = _a.avoidFalseZero,
      avoidFalseZero = _e === void 0 ? false : _e;
    var onLayout = function(e, index, fontSize, label) {
      if (_this.state.onLayout) {
        var width = e.nativeEvent.layout.width;
        var target =
          _this.props.width - _this.props.width * chartWidthPercentage - 84;
        var calculating = _this.state.calculating;
        if (width < target) {
          calculating[index].calculating = false;
          _this.setState(__assign({ calculating: calculating }, _this.state));
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
          var numberOfCharacters = label.length;
          var ratio = target / width;
          var targetCharacters = Math.floor(ratio * numberOfCharacters);
          label = label.slice(0, targetCharacters) + "...";
          calculating[index].label.name = label;
          if (label === "...") {
            calculating[index].calculating = false;
          }
          _this.setState(__assign({ calculating: calculating }, _this.state));
        }
      }
    };
    var calculations = this.state.calculating.map(function(item, index) {
      var _a = item.label,
        name = _a.name,
        legendFontFamily = _a.legendFontFamily,
        legendFontSize = _a.legendFontSize,
        legendFontWeight = _a.legendFontWeight,
        value = _a.value;
      if (item.calculating && _this.props.hasLegend) {
        if (_this.props.absolute === false) {
          value = "55%";
        }
        if (_this.props.showLabelPrefix === false) {
          value = "";
        }
        if (!isObject(value)) {
          return (
            <View
              key={index}
              style={{ alignSelf: "flex-start", position: "absolute" }}
              onLayout={function(e) {
                return onLayout(e, index, legendFontSize, name);
              }}
            >
              <NativeText
                style={{
                  fontFamily: legendFontFamily,
                  fontSize: legendFontSize,
                  fontWeight: legendFontWeight,
                  color: "transparent"
                }}
              >
                {value + " " + name}
              </NativeText>
            </View>
          );
        } else {
          return (
            <View
              key={index}
              style={{ alignSelf: "flex-start", position: "absolute" }}
              onLayout={function(e) {
                return onLayout(e, index, legendFontSize, name);
              }}
            >
              <NativeText
                style={{
                  fontFamily: legendFontFamily,
                  fontSize: legendFontSize,
                  fontWeight: legendFontWeight,
                  color: "transparent"
                }}
              >
                {value.whole + "% " + name}
              </NativeText>
            </View>
          );
        }
      }
    });
    var _f = style.borderRadius,
      borderRadius = _f === void 0 ? 0 : _f;
    var chartWidthPercentage = this.props.chartWidthPercentage * 0.01;
    var radius;
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
    var chart = Pie({
      center: this.props.center || [0, 0],
      r: 0,
      R: radius,
      data: this.state.data,
      accessor: function(x) {
        return x[_this.props.accessor];
      }
    });
    var total = this.state.data.reduce(function(sum, item) {
      if (isObject(item[_this.props.accessor])) {
        return sum + item[_this.props.accessor].whole;
      } else {
        return sum + item[_this.props.accessor];
      }
    }, 0);
    var uppedIndices = [];
    if (!absolute) {
      var divisor_1 = total / 100.0;
      var wholeTotal_1 = 0;
      chart.curves.forEach(function(c, i) {
        if (!isObject(c.item.values)) {
          var percentage = c.item[_this.props.accessor] / divisor_1;
          var pieces = percentage.toString().split(".");
          var whole = parseInt(pieces[0]);
          var decimal = parseFloat("." + pieces[1]);
          if (isNaN(decimal)) {
            decimal = 0;
          }
          wholeTotal_1 += whole;
          //had to create a new object here to use for percentages, chart wouldn't render when assigning the object to c.item[this.props.accessor]
          c.item.values = {
            index: i,
            whole: whole,
            decimal: decimal
          };
        } else {
          wholeTotal_1 += c.item.values.whole;
        }
      });
      var hamiltonDiff = 100 - wholeTotal_1;
      var sortedCurves = __spreadArrays(chart.curves).sort(function(a, b) {
        return a.item.values.decimal < b.item.values.decimal ? 1 : -1;
      });
      for (var i = 0; i < hamiltonDiff; i++) {
        uppedIndices.push(sortedCurves[i].item.values.index);
      }
    }
    var slices = chart.curves.map(function(c, i) {
      var value;
      if (absolute) {
        if (_this.props.showLabelPrefix) {
          value = c.item[_this.props.accessor];
        } else {
          value = "";
        }
      } else {
        //calculate percentage using Hamilton's method
        if (total === 0) {
          value = 0 + "%";
        } else {
          var item = c.item.values;
          var percentage = item.whole;
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
      var textColor = _this.state.calculating[i]
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
                _this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
                24
              }
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.state.data.length) * i +
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
              x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.state.data.length) * i +
                12 * 2
              }
              onPress={c.item.action}
              //@ts-ignore
              onClick={c.item.action}
            >
              {value + " " + c.item.name}
            </Text>
          ) : null}
        </G>
      );
    });
    return (
      <View
        style={__assign(
          { width: this.props.width, height: this.props.height, padding: 0 },
          style
        )}
      >
        <Svg
          width={this.props.width}
          height={this.props.height}
          style={{ paddingRight: 16 }}
        >
          <G>
            {this.renderDefs(
              __assign(
                { width: this.props.height, height: this.props.height },
                this.props.chartConfig
              )
            )}
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
  };
  return PieChart;
})(AbstractChart);
export default PieChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQW1CLE1BQU0sT0FBTyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQWEsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQTBCcEUsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7WUFDbkIsSUFBTSxLQUFLLHlCQUNOLEtBQUssS0FDUixNQUFNLEVBQUUsSUFBSSxHQUNiLENBQUM7WUFDRixJQUFNLEtBQUsseUJBQ04sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUNYLE1BQU0sRUFBRSxJQUFJLEdBQ2IsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDLENBQUM7QUFFRjtJQUF1Qiw0QkFBMkM7SUFvQ2hFLGtCQUFZLEtBQUs7UUFBakIsWUFDRSxrQkFBTSxLQUFLLENBQUMsU0FXYjtRQVZDLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDbkU7UUFDRCxLQUFJLENBQUMsS0FBSyx1QkFDUixXQUFXLGFBQUEsRUFDWCxRQUFRLEVBQUUsSUFBSSxJQUNYLEtBQUssS0FDUixTQUFTLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQzNCLENBQUM7O0lBQ0osQ0FBQztJQS9DRCxxQ0FBa0IsR0FBbEIsVUFBbUIsU0FBUztRQUMxQixJQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxNQUFNO1lBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLG9CQUFvQjtZQUNsRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDbkQ7WUFDQSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUNuRTtZQUNELElBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxNQUFNO2dCQUMvRCxDQUFDO2dCQUNILElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLO2dCQUNwQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDbEIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNsRDtnQkFDQSxJQUFJLENBQUMsUUFBUSxxQkFDWCxXQUFXLGFBQUEsRUFDWCxRQUFRLEVBQUUsS0FBSyxJQUNaLElBQUksQ0FBQyxLQUFLLEdBQ1YsSUFBSSxDQUFDLEtBQUssRUFDYixDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsWUFDWCxXQUFXLGFBQUEsRUFDWCxRQUFRLEVBQUUsSUFBSSxJQUNYLElBQUksQ0FBQyxLQUFLO2dCQUNiLGdCQUFnQjtrQkFDaEIsQ0FBQzthQUNKO1NBQ0Y7SUFDSCxDQUFDO0lBZ0JELHlCQUFNLEdBQU47UUFBQSxpQkFpVEM7UUFoVE8sSUFBQSxLQU1GLElBQUksQ0FBQyxLQUFLLEVBTFosYUFBVSxFQUFWLEtBQUssbUJBQUcsRUFBRSxLQUFBLEVBQ1YsZUFBZSxxQkFBQSxFQUNmLGdCQUFnQixFQUFoQixRQUFRLG1CQUFHLEtBQUssS0FBQSxFQUNoQixpQkFBZ0IsRUFBaEIsU0FBUyxtQkFBRyxJQUFJLEtBQUEsRUFDaEIsc0JBQXNCLEVBQXRCLGNBQWMsbUJBQUcsS0FBSyxLQUNWLENBQUM7UUFFZixJQUFNLFFBQVEsR0FBRyxVQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUs7WUFDekMsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN2QyxJQUFJLE1BQU0sR0FDUixLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7Z0JBQ2xFLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUV6QyxJQUFJLEtBQUssR0FBRyxNQUFNLEVBQUU7b0JBQ2xCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUN2QyxLQUFJLENBQUMsUUFBUSxZQUNYLFdBQVcsYUFBQSxJQUNSLEtBQUksQ0FBQyxLQUFLLEVBQ2IsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7d0JBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM1QjtvQkFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDYixRQUFRLEdBQUcsTUFBTSxDQUFDO3lCQUNuQjt3QkFDRCxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUM5Qzt5QkFBTTt3QkFDTCxNQUFNLEdBQUcsTUFBTSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7cUJBQ2hDO29CQUNELElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFDeEMsSUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDN0IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO29CQUNoRSxLQUFLLEdBQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsUUFBSyxDQUFDO29CQUNqRCxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ3RDLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTt3QkFDbkIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7cUJBQ3hDO29CQUNELEtBQUksQ0FBQyxRQUFRLFlBQ1gsV0FBVyxhQUFBLElBQ1IsS0FBSSxDQUFDLEtBQUssRUFDYixDQUFDO2lCQUNKO2FBQ0Y7UUFDSCxDQUFDLENBQUM7UUFFRixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztZQUN0RCxJQUFBLEtBTUEsSUFBSSxDQUFDLEtBQUssRUFMWixJQUFJLFVBQUEsRUFDSixnQkFBZ0Isc0JBQUEsRUFDaEIsY0FBYyxvQkFBQSxFQUNkLGdCQUFnQixzQkFBQSxFQUNoQixLQUFLLFdBQ08sQ0FBQztZQUNmLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtnQkFDNUMsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7b0JBQ2pDLEtBQUssR0FBRyxLQUFLLENBQUE7aUJBQ2Q7Z0JBQ0QsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsS0FBSyxLQUFLLEVBQUU7b0JBQ3hDLEtBQUssR0FBRyxFQUFFLENBQUE7aUJBQ1g7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDcEIsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNYLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDekQsUUFBUSxDQUFDLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQXhDLENBQXdDLENBQUMsQ0FFeEQ7Y0FBQSxDQUFDLFVBQVUsQ0FDVCxLQUFLLENBQUMsQ0FBQzt3QkFDTCxVQUFVLEVBQUUsZ0JBQWdCO3dCQUM1QixRQUFRLEVBQUUsY0FBYzt3QkFDeEIsVUFBVSxFQUFFLGdCQUFnQjt3QkFDNUIsS0FBSyxFQUFFLGFBQWE7cUJBQ3JCLENBQUMsQ0FDSCxDQUFJLEtBQUssU0FBSSxJQUFNLENBQUMsRUFBRSxVQUFVLENBQ25DO1lBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO2lCQUNIO3FCQUFNO29CQUNMLE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQ3pELFFBQVEsQ0FBQyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBRXhEO2NBQUEsQ0FBQyxVQUFVLENBQ1QsS0FBSyxDQUFDLENBQUM7d0JBQ0wsVUFBVSxFQUFFLGdCQUFnQjt3QkFDNUIsUUFBUSxFQUFFLGNBQWM7d0JBQ3hCLFVBQVUsRUFBRSxnQkFBZ0I7d0JBQzVCLEtBQUssRUFBRSxhQUFhO3FCQUNyQixDQUFDLENBRUY7Z0JBQUEsQ0FDRyxLQUFLLENBQUMsS0FBSyxVQUFLLElBQU0sQ0FDM0I7Y0FBQSxFQUFFLFVBQVUsQ0FDZDtZQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztpQkFDSDthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSyxJQUFBLEtBQXFCLEtBQUssYUFBVixFQUFoQixZQUFZLG1CQUFHLENBQUMsS0FBQSxDQUFXO1FBRW5DLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFFbEUsSUFBSSxNQUFjLENBQUM7UUFFbkIsSUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHO1lBQ3ZCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEVBQzdDO1lBQ0EsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNqQyxvQkFBb0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4RDthQUFNO1lBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLG9CQUFvQixLQUFLLENBQUMsRUFBRTtZQUM5QixvQkFBb0IsR0FBRyxHQUFHLENBQUM7U0FDNUI7UUFFRCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLE1BQU07WUFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ3JCLFFBQVEsRUFBRSxVQUFBLENBQUM7Z0JBQ1QsT0FBTyxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7WUFDN0MsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDdkMsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQzlDO2lCQUFNO2dCQUNMLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRU4sSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRXRCLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixJQUFNLFNBQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzlCLElBQUksWUFBVSxHQUFHLENBQUMsQ0FBQztZQUNuQixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzVCLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFPLENBQUM7b0JBQ3pELElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hELElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ2xCLE9BQU8sR0FBRyxDQUFDLENBQUM7cUJBQ2I7b0JBQ0QsWUFBVSxJQUFJLEtBQUssQ0FBQztvQkFDcEIsd0lBQXdJO29CQUN4SSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRzt3QkFDZCxLQUFLLEVBQUUsQ0FBQzt3QkFDUixLQUFLLE9BQUE7d0JBQ0wsT0FBTyxTQUFBO3FCQUNSLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsWUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztpQkFDbkM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sWUFBWSxHQUFHLEdBQUcsR0FBRyxZQUFVLENBQUM7WUFDdEMsSUFBTSxZQUFZLEdBQUcsZUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMvQyxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQXRELENBQXNELENBQ3ZELENBQUM7WUFDRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3REO1NBQ0Y7UUFFRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQ25DLElBQUksS0FBYSxDQUFDO1lBRWxCLElBQUksUUFBUSxFQUFFO2dCQUNaLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7b0JBQzlCLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3JDO3FCQUFNO29CQUNMLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQ1o7YUFDRjtpQkFBTTtnQkFDTCw4Q0FBOEM7Z0JBQzlDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtvQkFDZixLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztpQkFDakI7cUJBQU07b0JBQ0wsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQzNCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQzVCLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3JDLFVBQVUsSUFBSSxDQUFDLENBQUM7cUJBQ2pCO29CQUNELElBQUksY0FBYyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO3dCQUM1RCxLQUFLLEdBQUcsS0FBSyxDQUFDO3FCQUNmO3lCQUFNO3dCQUNMLEtBQUssR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDO3FCQUMxQjtpQkFDRjthQUNGO1lBRUQsSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUE7WUFFbEYsT0FBTyxDQUNMLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNwQjtVQUFBLENBQUMsSUFBSSxDQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQ3pCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25CLG1CQUFtQjtZQUNuQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QixZQUFZO1lBQ1osT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFFekI7VUFBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FDWCxDQUFDLElBQUksQ0FDSCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDVixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDTixDQUFDLENBQUMsQ0FDQSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDN0QsRUFBRSxDQUNILENBQ0QsQ0FBQyxDQUFDLENBQ0EsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ3hELEVBQUUsQ0FDSCxDQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLFlBQVk7WUFDWixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUN2QixDQUNILENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDUjtVQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUNYLENBQUMsSUFBSSxDQUNILElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNoQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUNoQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQ3BDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FDcEMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUNqRSxDQUFDLENBQUMsQ0FDQSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDeEQsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLFlBQVk7WUFDWixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUV2QjtjQUFBLENBQUksS0FBSyxTQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUM1QjtZQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNWO1FBQUEsRUFBRSxDQUFDLENBQUMsQ0FDTCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsS0FBSyxDQUFDLFlBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQ3pCLE9BQU8sRUFBRSxDQUFDLElBQ1AsS0FBSyxFQUNSLENBRUY7UUFBQSxDQUFDLEdBQUcsQ0FDRixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUN4QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUMxQixLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUU1QjtVQUFBLENBQUMsQ0FBQyxDQUNBO1lBQUEsQ0FBQyxJQUFJLENBQUMsVUFBVSxZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFDeEIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFDekIsQ0FDSjtVQUFBLEVBQUUsQ0FBQyxDQUNIO1VBQUEsQ0FBQyxJQUFJLENBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FDWixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUMxQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDakIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUV4QjtVQUFBLENBQUMsQ0FBQyxDQUNBLENBQUMsQ0FBQyxDQUNBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM1RCxDQUNELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN6QixtQkFBbUI7UUFDbkIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FFeEI7WUFBQSxDQUFDLE1BQU0sQ0FDVDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLFlBQVksQ0FDZjtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQXBXRCxDQUF1QixhQUFhLEdBb1duQztBQUVELGVBQWUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgUGllIGZyb20gXCJwYXRocy1qcy9waWVcIjtcbmltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlLCBUZXh0IGFzIE5hdGl2ZVRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQgeyBHLCBQYXRoLCBSZWN0LCBTdmcsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwgeyBBYnN0cmFjdENoYXJ0UHJvcHMgfSBmcm9tIFwiLi9BYnN0cmFjdENoYXJ0XCI7XG4vLyBpbXBvcnQgVGV4dFdpZHRoRmluZGVyIGZyb20gXCIuL1RleHRXaWR0aEZpbmRlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgY2hhcnRXaWR0aFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgc2hvd0xhYmVsUHJlZml4OiBib29sZWFuO1xuICBlZGl0b3I6IGJvb2xlYW47XG59XG5cbnR5cGUgUGllQ2hhcnRTdGF0ZSA9IHtcbiAgZGF0YTogQXJyYXk8YW55PjtcbiAgb25MYXlvdXQ6IGJvb2xlYW47XG4gIGNhbGN1bGF0aW5nOiBBcnJheTxhbnk+O1xufTtcblxuY29uc3QgY29tcGFyZURhdGFBcnJheXMgPSAoYSwgYikgPT4ge1xuICAvL1RPRE86IHJlbW92ZSB2YWx1ZXMgZmllbGQgZnJvbSBhIGFuZCBiXG4gIC8vVE9ETzogZ2V0IHRoZSBzdW0gb2YgdmFsdWVzIHRvIG1ha2Ugc3VyZSBwZXJjZW50YWdlcyBzdGF5IHRoZSBzYW1lXG4gIGxldCBzdW1BID0gYS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZTtcbiAgfSwgMCk7XG5cbiAgbGV0IHN1bUIgPSBiLnJlZHVjZSgoYWNjdW11bGF0b3IsIGl0ZW0pID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBpdGVtLnZhbHVlO1xuICB9LCAwKTtcblxuICByZXR1cm4gKFxuICAgIHN1bUEgPT09IHN1bUIgJiZcbiAgICBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiZcbiAgICBhLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGFDb3B5ID0ge1xuICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgdmFsdWVzOiBudWxsXG4gICAgICB9O1xuICAgICAgY29uc3QgYkNvcHkgPSB7XG4gICAgICAgIC4uLmJbaW5kZXhdLFxuICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgIH07XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYUNvcHkpID09PSBKU09OLnN0cmluZ2lmeShiQ29weSk7XG4gICAgfSlcbiAgKTtcbn07XG5cbmNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxQaWVDaGFydFByb3BzLCBQaWVDaGFydFN0YXRlPiB7XG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLndpZHRoICE9PSBwcmV2UHJvcHMud2lkdGggfHxcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0ICE9PSBwcmV2UHJvcHMuaGVpZ2h0IHx8XG4gICAgICB0aGlzLnByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlICE9PSBwcmV2UHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgfHxcbiAgICAgICFjb21wYXJlRGF0YUFycmF5cyh0aGlzLnByb3BzLmRhdGEsIHByZXZQcm9wcy5kYXRhKVxuICAgICkge1xuICAgICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYWxjdWxhdGluZ1tpXSA9IHsgbGFiZWw6IHRoaXMucHJvcHMuZGF0YVtpXSwgY2FsY3VsYXRpbmc6IHRydWUgfTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5maWx0ZXIoaSA9PiBpLmNhbGN1bGF0aW5nID09PSB0cnVlKS5sZW5ndGggPT09XG4gICAgICAgICAgMCAmJlxuICAgICAgICB0aGlzLnByb3BzLndpZHRoID09PSBwcmV2UHJvcHMud2lkdGggJiZcbiAgICAgICAgIXRoaXMucHJvcHMuZWRpdG9yICYmXG4gICAgICAgIGNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgb25MYXlvdXQ6IGZhbHNlLFxuICAgICAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgIG9uTGF5b3V0OiB0cnVlLFxuICAgICAgICAgIC4uLnRoaXMucHJvcHNcbiAgICAgICAgICAvLyAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYWxjdWxhdGluZ1tpXSA9IHsgbGFiZWw6IHRoaXMucHJvcHMuZGF0YVtpXSwgY2FsY3VsYXRpbmc6IHRydWUgfTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGxhYmVsRGF0YTogdGhpcy5wcm9wcy5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgYWJzb2x1dGUgPSBmYWxzZSxcbiAgICAgIGhhc0xlZ2VuZCA9IHRydWUsXG4gICAgICBhdm9pZEZhbHNlWmVybyA9IGZhbHNlXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBvbkxheW91dCA9IChlLCBpbmRleCwgZm9udFNpemUsIGxhYmVsKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5vbkxheW91dCkge1xuICAgICAgICBsZXQgd2lkdGggPSBlLm5hdGl2ZUV2ZW50LmxheW91dC53aWR0aDtcbiAgICAgICAgbGV0IHRhcmdldCA9XG4gICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAtIHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSAtIDg0O1xuICAgICAgICBsZXQgY2FsY3VsYXRpbmcgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nO1xuXG4gICAgICAgIGlmICh3aWR0aCA8IHRhcmdldCkge1xuICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGxhYmVsLnNsaWNlKC0zKSA9PT0gXCIuLi5cIikge1xuICAgICAgICAgICAgbGFiZWwgPSBsYWJlbC5zbGljZSgwLCAtMyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc05hTihmb250U2l6ZSkpIHtcbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgZm9udFNpemUgPSBcIjEycHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCAtIGZvbnRTaXplLnNwbGl0KFwicFwiKVswXSAqIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCAtIGZvbnRTaXplICogMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbnVtYmVyT2ZDaGFyYWN0ZXJzID0gbGFiZWwubGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IHJhdGlvID0gdGFyZ2V0IC8gd2lkdGg7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Q2hhcmFjdGVycyA9IE1hdGguZmxvb3IocmF0aW8gKiBudW1iZXJPZkNoYXJhY3RlcnMpO1xuICAgICAgICAgIGxhYmVsID0gYCR7bGFiZWwuc2xpY2UoMCwgdGFyZ2V0Q2hhcmFjdGVycyl9Li4uYDtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0ubGFiZWwubmFtZSA9IGxhYmVsO1xuICAgICAgICAgIGlmIChsYWJlbCA9PT0gXCIuLi5cIikge1xuICAgICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmNhbGN1bGF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgY2FsY3VsYXRpb25zID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQge1xuICAgICAgICBuYW1lLFxuICAgICAgICBsZWdlbmRGb250RmFtaWx5LFxuICAgICAgICBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgbGVnZW5kRm9udFdlaWdodCxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0gPSBpdGVtLmxhYmVsO1xuICAgICAgaWYgKGl0ZW0uY2FsY3VsYXRpbmcgJiYgdGhpcy5wcm9wcy5oYXNMZWdlbmQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYWJzb2x1dGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSAnNTUlJ1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCJcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID57YCR7dmFsdWV9ICR7bmFtZX1gfTwvTmF0aXZlVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Ly9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgYCR7dmFsdWUud2hvbGV9JSAke25hbWV9YH1cbiAgICAgICAgICAgICAgPC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCB9ID0gc3R5bGU7XG5cbiAgICBsZXQgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSB0aGlzLnByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlICogMC4wMTtcblxuICAgIGxldCByYWRpdXM6IG51bWJlcjtcblxuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41IDxcbiAgICAgICh0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UpIC8gMlxuICAgICkge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjU7XG4gICAgICBjaGFydFdpZHRoUGVyY2VudGFnZSA9IDIgKiAocmFkaXVzIC8gdGhpcy5wcm9wcy53aWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGl1cyA9IHRoaXMucHJvcHMud2lkdGggKiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLyAyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPT09IDEpIHtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMC41O1xuICAgIH1cblxuICAgIGxldCBjaGFydCA9IFBpZSh7XG4gICAgICBjZW50ZXI6IHRoaXMucHJvcHMuY2VudGVyIHx8IFswLCAwXSxcbiAgICAgIHI6IDAsXG4gICAgICBSOiByYWRpdXMsXG4gICAgICBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsXG4gICAgICBhY2Nlc3NvcjogeCA9PiB7XG4gICAgICAgIHJldHVybiB4W3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnN0YXRlLmRhdGEucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcbiAgICAgIGlmIChpc09iamVjdChpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdKSkge1xuICAgICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXS53aG9sZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0sIDApO1xuXG4gICAgbGV0IHVwcGVkSW5kaWNlcyA9IFtdO1xuXG4gICAgaWYgKCFhYnNvbHV0ZSkge1xuICAgICAgY29uc3QgZGl2aXNvciA9IHRvdGFsIC8gMTAwLjA7XG4gICAgICBsZXQgd2hvbGVUb3RhbCA9IDA7XG4gICAgICBjaGFydC5jdXJ2ZXMuZm9yRWFjaCgoYywgaSkgPT4ge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGMuaXRlbS52YWx1ZXMpKSB7XG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSAvIGRpdmlzb3I7XG4gICAgICAgICAgY29uc3QgcGllY2VzID0gcGVyY2VudGFnZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICBsZXQgd2hvbGUgPSBwYXJzZUludChwaWVjZXNbMF0pO1xuICAgICAgICAgIGxldCBkZWNpbWFsID0gcGFyc2VGbG9hdChcIi5cIiArIHBpZWNlc1sxXSk7XG4gICAgICAgICAgaWYgKGlzTmFOKGRlY2ltYWwpKSB7XG4gICAgICAgICAgICBkZWNpbWFsID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgd2hvbGVUb3RhbCArPSB3aG9sZTtcbiAgICAgICAgICAvL2hhZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGhlcmUgdG8gdXNlIGZvciBwZXJjZW50YWdlcywgY2hhcnQgd291bGRuJ3QgcmVuZGVyIHdoZW4gYXNzaWduaW5nIHRoZSBvYmplY3QgdG8gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdXG4gICAgICAgICAgYy5pdGVtLnZhbHVlcyA9IHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgd2hvbGUsXG4gICAgICAgICAgICBkZWNpbWFsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aG9sZVRvdGFsICs9IGMuaXRlbS52YWx1ZXMud2hvbGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoYW1pbHRvbkRpZmYgPSAxMDAgLSB3aG9sZVRvdGFsO1xuICAgICAgY29uc3Qgc29ydGVkQ3VydmVzID0gWy4uLmNoYXJ0LmN1cnZlc10uc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy5kZWNpbWFsIDwgYi5pdGVtLnZhbHVlcy5kZWNpbWFsID8gMSA6IC0xXG4gICAgICApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYW1pbHRvbkRpZmY7IGkrKykge1xuICAgICAgICB1cHBlZEluZGljZXMucHVzaChzb3J0ZWRDdXJ2ZXNbaV0uaXRlbS52YWx1ZXMuaW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNsaWNlcyA9IGNoYXJ0LmN1cnZlcy5tYXAoKGMsIGkpID0+IHtcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xuXG4gICAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc2hvd0xhYmVsUHJlZml4KSB7XG4gICAgICAgICAgdmFsdWUgPSBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2NhbGN1bGF0ZSBwZXJjZW50YWdlIHVzaW5nIEhhbWlsdG9uJ3MgbWV0aG9kXG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHZhbHVlID0gMCArIFwiJVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjLml0ZW0udmFsdWVzO1xuICAgICAgICAgIGxldCBwZXJjZW50YWdlID0gaXRlbS53aG9sZTtcbiAgICAgICAgICBpZiAodXBwZWRJbmRpY2VzLmluY2x1ZGVzKGl0ZW0uaW5kZXgpKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhdm9pZEZhbHNlWmVybyAmJiBpdGVtLndob2xlID09PSAwICYmIGl0ZW0uZGVjaW1hbCAhPT0gMCkge1xuICAgICAgICAgICAgdmFsdWUgPSBcIjwxJVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBlcmNlbnRhZ2UgKyBcIiVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHRleHRDb2xvciA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmdbaV0gPyBjLml0ZW0ubGVnZW5kRm9udENvbG9yIDogJ3RyYW5zcGFyZW50J1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxuICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICBkPXtjLnNlY3Rvci5wYXRoLnByaW50KCl9XG4gICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICAvLyBmaWxsPXt0ZXh0Q29sb3J9XG4gICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2hhc0xlZ2VuZCA/IChcbiAgICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICAgIHdpZHRoPXsxNn1cbiAgICAgICAgICAgICAgaGVpZ2h0PXsxNn1cbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtgJHt2YWx1ZX0gJHtjLml0ZW0ubmFtZX1gfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0c+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIC4uLnN0eWxlXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmdSaWdodDogMTYgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICByeT17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgZmlsbD17YmFja2dyb3VuZENvbG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEdcbiAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAodGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlKSAvIDIgK1xuICAgICAgICAgICAgICBOdW1iZXIodGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA/IHRoaXMucHJvcHMucGFkZGluZ0xlZnQgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeT17dGhpcy5wcm9wcy5oZWlnaHQgLyAyfVxuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3NsaWNlc31cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgICB7Y2FsY3VsYXRpb25zfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGllQ2hhcnQ7XG4iXX0=
