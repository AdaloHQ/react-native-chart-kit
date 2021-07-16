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
        // !this.props.editor &&
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
    //TODO: move setState out of onlayout since it runs in a for loop
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
        console.log("item", item, "index", index);
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
    if (!absolute) {
      chart.curves = chart.curves.sort(function(a, b) {
        return a.item.values.whole > b.item.values.whole;
      });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQW1CLE1BQU0sT0FBTyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQWEsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRzVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQTBCcEUsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7WUFDbkIsSUFBTSxLQUFLLHlCQUNOLEtBQUssS0FD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QUMsQ0FDMUIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqQixJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFFeEI7VUFBQSxDQUFDLENBQUMsQ0FDQSxDQUFDLENBQUMsQ0FDQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FDRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDekIsbUJBQW1CO1FBQ25CLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBRXhCO1lBQUEsQ0FBQyxNQUFNLENBQ1Q7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxZQUFZLENBQ2Y7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUE5V0QsQ0FBdUIsYUFBYSxHQThXbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XG5pbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSwgVGV4dCBhcyBOYXRpdmVUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcbmltcG9ydCBjbG9uZSBmcm9tICdyZmRjL2RlZmF1bHQnXG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbi8vIGltcG9ydCBUZXh0V2lkdGhGaW5kZXIgZnJvbSBcIi4vVGV4dFdpZHRoRmluZGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhY2Nlc3Nvcjogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgYXZvaWRGYWxzZVplcm8/OiBib29sZWFuO1xuICBjaGFydFdpZHRoUGVyY2VudGFnZTogbnVtYmVyO1xuICBzaG93TGFiZWxQcmVmaXg6IGJvb2xlYW47XG4gIGVkaXRvcjogYm9vbGVhbjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICBvbkxheW91dDogYm9vbGVhbjtcbiAgY2FsY3VsYXRpbmc6IEFycmF5PGFueT47XG59O1xuXG5jb25zdCBjb21wYXJlRGF0YUFycmF5cyA9IChhLCBiKSA9PiB7XG4gIC8vVE9ETzogcmVtb3ZlIHZhbHVlcyBmaWVsZCBmcm9tIGEgYW5kIGJcbiAgLy9UT0RPOiBnZXQgdGhlIHN1bSBvZiB2YWx1ZXMgdG8gbWFrZSBzdXJlIHBlcmNlbnRhZ2VzIHN0YXkgdGhlIHNhbWVcbiAgbGV0IHN1bUEgPSBhLnJlZHVjZSgoYWNjdW11bGF0b3IsIGl0ZW0pID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBpdGVtLnZhbHVlO1xuICB9LCAwKTtcblxuICBsZXQgc3VtQiA9IGIucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIHJldHVybiAoXG4gICAgc3VtQSA9PT0gc3VtQiAmJlxuICAgIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJlxuICAgIGEuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgYUNvcHkgPSB7XG4gICAgICAgIC4uLnZhbHVlLFxuICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgIH07XG4gICAgICBjb25zdCBiQ29weSA9IHtcbiAgICAgICAgLi4uYltpbmRleF0sXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhQ29weSkgPT09IEpTT04uc3RyaW5naWZ5KGJDb3B5KTtcbiAgICB9KVxuICApO1xufTtcblxuY2xhc3MgUGllQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFBpZUNoYXJ0UHJvcHMsIFBpZUNoYXJ0U3RhdGU+IHtcbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgIT09IHByZXZQcm9wcy5oZWlnaHQgfHxcbiAgICAgIHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgIT09IHByZXZQcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSB8fFxuICAgICAgIWNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgKSB7XG4gICAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLmZpbHRlcihpID0+IGkuY2FsY3VsYXRpbmcgPT09IHRydWUpLmxlbmd0aCA9PT1cbiAgICAgICAgICAwICYmXG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggPT09IHByZXZQcm9wcy53aWR0aCAmJlxuICAgICAgICAvLyAhdGhpcy5wcm9wcy5lZGl0b3IgJiZcbiAgICAgICAgY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogZmFsc2UsXG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgLi4udGhpcy5wcm9wc1xuICAgICAgICAgIC8vIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICBvbkxheW91dDogdHJ1ZSxcbiAgICAgIC4uLnByb3BzLFxuICAgICAgbGFiZWxEYXRhOiB0aGlzLnByb3BzLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gZmFsc2VcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vVE9ETzogbW92ZSBzZXRTdGF0ZSBvdXQgb2Ygb25sYXlvdXQgc2luY2UgaXQgcnVucyBpbiBhIGZvciBsb29wXG4gICAgY29uc3Qgb25MYXlvdXQgPSAoZSwgaW5kZXgsIGZvbnRTaXplLCBsYWJlbCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUub25MYXlvdXQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZS5uYXRpdmVFdmVudC5sYXlvdXQud2lkdGg7XG4gICAgICAgIGxldCB0YXJnZXQgPVxuICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLSB0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLSA4NDtcbiAgICAgICAgbGV0IGNhbGN1bGF0aW5nID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZztcblxuICAgICAgICBpZiAod2lkdGggPCB0YXJnZXQpIHtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYWJlbC5zbGljZSgtMykgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFiZWwuc2xpY2UoMCwgLTMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNOYU4oZm9udFNpemUpKSB7XG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgIGZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZS5zcGxpdChcInBcIilbMF0gKiAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZSAqIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG51bWJlck9mQ2hhcmFjdGVycyA9IGxhYmVsLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByYXRpbyA9IHRhcmdldCAvIHdpZHRoO1xuICAgICAgICAgIGNvbnN0IHRhcmdldENoYXJhY3RlcnMgPSBNYXRoLmZsb29yKHJhdGlvICogbnVtYmVyT2ZDaGFyYWN0ZXJzKTtcbiAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsLnNsaWNlKDAsIHRhcmdldENoYXJhY3RlcnMpfS4uLmA7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmxhYmVsLm5hbWUgPSBsYWJlbDtcbiAgICAgICAgICBpZiAobGFiZWwgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpdGVtJywgaXRlbSwgJ2luZGV4JywgaW5kZXgpXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFic29sdXRlID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCI1NSVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXggPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMuc3RhdGUuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIHVwcGVkSW5kaWNlcy5wdXNoKHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy5pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFhYnNvbHV0ZSkge1xuICAgICAgY2hhcnQuY3VydmVzID0gY2hhcnQuY3VydmVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhLml0ZW0udmFsdWVzLndob2xlID4gYi5pdGVtLnZhbHVlcy53aG9sZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzbGljZXMgPSBjaGFydC5jdXJ2ZXMubWFwKChjLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IHN0cmluZztcblxuICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCkge1xuICAgICAgICAgIHZhbHVlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgcGVyY2VudGFnZSB1c2luZyBIYW1pbHRvbidzIG1ldGhvZFxuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYy5pdGVtLnZhbHVlcztcbiAgICAgICAgICBsZXQgcGVyY2VudGFnZSA9IGl0ZW0ud2hvbGU7XG4gICAgICAgICAgaWYgKHVwcGVkSW5kaWNlcy5pbmNsdWRlcyhpdGVtLmluZGV4KSkge1xuICAgICAgICAgICAgcGVyY2VudGFnZSArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXZvaWRGYWxzZVplcm8gJiYgaXRlbS53aG9sZSA9PT0gMCAmJiBpdGVtLmRlY2ltYWwgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBwZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2ldXG4gICAgICAgID8gYy5pdGVtLmxlZ2VuZEZvbnRDb2xvclxuICAgICAgICA6IFwidHJhbnNwYXJlbnRcIjtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgZD17Yy5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgLy8gZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD17MTZ9XG4gICAgICAgICAgICAgIGhlaWdodD17MTZ9XG4gICAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgICAgcng9ezh9XG4gICAgICAgICAgICAgIHJ5PXs4fVxuICAgICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLndpZHRoIC8gKDEwMCAvIChjaGFydFdpZHRoUGVyY2VudGFnZSAqIDEwMCkgKyAwLjUpIC1cbiAgICAgICAgICAgICAgICAyNFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2hhc0xlZ2VuZCA/IChcbiAgICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICAgIGZpbGw9e3RleHRDb2xvcn1cbiAgICAgICAgICAgICAgZm9udFNpemU9e2MuaXRlbS5sZWdlbmRGb250U2l6ZX1cbiAgICAgICAgICAgICAgZm9udEZhbWlseT17Yy5pdGVtLmxlZ2VuZEZvbnRGYW1pbHl9XG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ9e2MuaXRlbS5sZWdlbmRGb250V2VpZ2h0fVxuICAgICAgICAgICAgICB4PXt0aGlzLnByb3BzLndpZHRoIC8gKDEwMCAvIChjaGFydFdpZHRoUGVyY2VudGFnZSAqIDEwMCkgKyAwLjUpfVxuICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgICAgICAgIDEyICogMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YCR7dmFsdWV9ICR7Yy5pdGVtLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDE2IH19XG4gICAgICAgID5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgICAge2NhbGN1bGF0aW9uc31cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19
