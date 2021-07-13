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
    var total = this.props.data.reduce(function(sum, item) {
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
                _this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
                24
              }
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12
              }
              onPress={c.item.action}
              //@ts-ignore
              onClick={c.item.action}
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={
                _this.state.calculating[i].calculating && !_this.props.editor
                  ? "transparent"
                  : c.item.legendFontColor
              }
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              fontWeight={c.item.legendFontWeight}
              x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12 * 2
              }
              onPress={c.item.action}
              //@ts-ignore
              onClick={c.item.action}
            >
              {value + " " + _this.state.calculating[c.index].label.name}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQW1CLE1BQU0sT0FBTyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQWEsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQTBCcEUsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDakMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRUwsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDakMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRUwsT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUNMLFVBQUMsS0FBSyxFQUFFLEtBQUs7WUFDWCxJQUFNLEtBQUsseUJBQ04sS0FBSyxLQUNS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Q0FDVDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLFlBQVksQ0FDZjtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQS9WRCxDQUF1QixhQUFhLEdBK1ZuQztBQUVELGVBQWUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgUGllIGZyb20gXCJwYXRocy1qcy9waWVcIjtcbmltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlLCBUZXh0IGFzIE5hdGl2ZVRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQgeyBHLCBQYXRoLCBSZWN0LCBTdmcsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwgeyBBYnN0cmFjdENoYXJ0UHJvcHMgfSBmcm9tIFwiLi9BYnN0cmFjdENoYXJ0XCI7XG4vLyBpbXBvcnQgVGV4dFdpZHRoRmluZGVyIGZyb20gXCIuL1RleHRXaWR0aEZpbmRlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgY2hhcnRXaWR0aFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgc2hvd0xhYmVsUHJlZml4OiBib29sZWFuO1xuICBlZGl0b3I6IGJvb2xlYW47XG59XG5cbnR5cGUgUGllQ2hhcnRTdGF0ZSA9IHtcbiAgZGF0YTogQXJyYXk8YW55PjtcbiAgb25MYXlvdXQ6IGJvb2xlYW47XG4gIGNhbGN1bGF0aW5nOiBBcnJheTxhbnk+O1xufTtcblxuY29uc3QgY29tcGFyZURhdGFBcnJheXMgPSAoYSwgYikgPT4ge1xuICAvL1RPRE86IHJlbW92ZSB2YWx1ZXMgZmllbGQgZnJvbSBhIGFuZCBiXG4gIC8vVE9ETzogZ2V0IHRoZSBzdW0gb2YgdmFsdWVzIHRvIG1ha2Ugc3VyZSBwZXJjZW50YWdlcyBzdGF5IHRoZSBzYW1lXG4gIGxldCBzdW1BID0gYS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZVxuICB9LCAwKVxuXG4gIGxldCBzdW1CID0gYi5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZVxuICB9LCAwKVxuXG4gIHJldHVybiAoXG4gICAgc3VtQSA9PT0gc3VtQiAmJlxuICAgIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJlxuICAgIGEuZXZlcnkoXG4gICAgICAodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFDb3B5ID0ge1xuICAgICAgICAgIC4uLnZhbHVlLFxuICAgICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJDb3B5ID0ge1xuICAgICAgICAgIC4uLmJbaW5kZXhdLFxuICAgICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhQ29weSkgPT09IEpTT04uc3RyaW5naWZ5KGJDb3B5KVxuICAgICAgfVxuICAgIClcbiAgKTtcbn07XG5cbmNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxQaWVDaGFydFByb3BzLCBQaWVDaGFydFN0YXRlPiB7XG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLndpZHRoICE9PSBwcmV2UHJvcHMud2lkdGggfHxcbiAgICAgIHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgIT09IHByZXZQcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSB8fFxuICAgICAgIWNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgKSB7XG4gICAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLmZpbHRlcihpID0+IGkuY2FsY3VsYXRpbmcgPT09IHRydWUpLmxlbmd0aCA9PT1cbiAgICAgICAgICAwICYmXG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggPT09IHByZXZQcm9wcy53aWR0aCAmJlxuICAgICAgICAhdGhpcy5wcm9wcy5lZGl0b3IgJiZcbiAgICAgICAgY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogZmFsc2UsXG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgLi4udGhpcy5wcm9wc1xuICAgICAgICAgIC8vIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYWxjdWxhdGluZyxcbiAgICAgIG9uTGF5b3V0OiB0cnVlLFxuICAgICAgLi4ucHJvcHMsXG4gICAgICBsYWJlbERhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIGFic29sdXRlID0gZmFsc2UsXG4gICAgICBoYXNMZWdlbmQgPSB0cnVlLFxuICAgICAgYXZvaWRGYWxzZVplcm8gPSBmYWxzZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qgb25MYXlvdXQgPSAoZSwgaW5kZXgsIGZvbnRTaXplLCBsYWJlbCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUub25MYXlvdXQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZS5uYXRpdmVFdmVudC5sYXlvdXQud2lkdGg7XG4gICAgICAgIGxldCB0YXJnZXQgPVxuICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLSB0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLSA4NDtcbiAgICAgICAgbGV0IGNhbGN1bGF0aW5nID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZztcblxuICAgICAgICBpZiAod2lkdGggPCB0YXJnZXQpIHtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYWJlbC5zbGljZSgtMykgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFiZWwuc2xpY2UoMCwgLTMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNOYU4oZm9udFNpemUpKSB7XG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgIGZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZS5zcGxpdChcInBcIilbMF0gKiAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZSAqIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG51bWJlck9mQ2hhcmFjdGVycyA9IGxhYmVsLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByYXRpbyA9IHRhcmdldCAvIHdpZHRoO1xuICAgICAgICAgIGNvbnN0IHRhcmdldENoYXJhY3RlcnMgPSBNYXRoLmZsb29yKHJhdGlvICogbnVtYmVyT2ZDaGFyYWN0ZXJzKTtcbiAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsLnNsaWNlKDAsIHRhcmdldENoYXJhY3RlcnMpfS4uLmA7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmxhYmVsLm5hbWUgPSBsYWJlbDtcbiAgICAgICAgICBpZiAobGFiZWwgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMucHJvcHMuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIHVwcGVkSW5kaWNlcy5wdXNoKHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy5pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnQuY3VydmVzLm1hcCgoYywgaSkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG5cbiAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXgpIHtcbiAgICAgICAgICB2YWx1ZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY2FsY3VsYXRlIHBlcmNlbnRhZ2UgdXNpbmcgSGFtaWx0b24ncyBtZXRob2RcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwICsgXCIlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGMuaXRlbS52YWx1ZXM7XG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBpdGVtLndob2xlO1xuICAgICAgICAgIGlmICh1cHBlZEluZGljZXMuaW5jbHVkZXMoaXRlbS5pbmRleCkpIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGF2b2lkRmFsc2VaZXJvICYmIGl0ZW0ud2hvbGUgPT09IDAgJiYgaXRlbS5kZWNpbWFsICE9PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiPDElXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxuICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICBkPXtjLnNlY3Rvci5wYXRoLnByaW50KCl9XG4gICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2hhc0xlZ2VuZCA/IChcbiAgICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICAgIHdpZHRoPXsxNn1cbiAgICAgICAgICAgICAgaGVpZ2h0PXsxNn1cbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgZmlsbD17XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jYWxjdWxhdGluZ1tpXS5jYWxjdWxhdGluZyAmJiAhdGhpcy5wcm9wcy5lZGl0b3JcbiAgICAgICAgICAgICAgICAgID8gXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgICA6IGMuaXRlbS5sZWdlbmRGb250Q29sb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMucHJvcHMuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtgJHt2YWx1ZX0gJHt0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2MuaW5kZXhdLmxhYmVsLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDE2IH19XG4gICAgICAgID5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgICAge2NhbGN1bGF0aW9uc31cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19
