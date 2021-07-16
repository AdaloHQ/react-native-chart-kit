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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQW1CLE1BQU0sT0FBTyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQWEsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQTBCcEUsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7WUFDbkIsSUFBTSxLQUFLLHlCQUNOLEtBQUssS0FD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QUMsQ0FDMUIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqQixJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFFeEI7VUFBQSxDQUFDLENBQUMsQ0FDQSxDQUFDLENBQUMsQ0FDQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FDRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDekIsbUJBQW1CO1FBQ25CLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBRXhCO1lBQUEsQ0FBQyxNQUFNLENBQ1Q7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxZQUFZLENBQ2Y7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUE5V0QsQ0FBdUIsYUFBYSxHQThXbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XG5pbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSwgVGV4dCBhcyBOYXRpdmVUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHsgQWJzdHJhY3RDaGFydFByb3BzIH0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuLy8gaW1wb3J0IFRleHRXaWR0aEZpbmRlciBmcm9tIFwiLi9UZXh0V2lkdGhGaW5kZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQaWVDaGFydFByb3BzIGV4dGVuZHMgQWJzdHJhY3RDaGFydFByb3BzIHtcbiAgZGF0YTogQXJyYXk8YW55PjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGFjY2Vzc29yOiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xuICBwYWRkaW5nTGVmdDogc3RyaW5nO1xuICBjZW50ZXI/OiBBcnJheTxudW1iZXI+O1xuICBhYnNvbHV0ZT86IGJvb2xlYW47XG4gIGhhc0xlZ2VuZD86IGJvb2xlYW47XG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xuICBhdm9pZEZhbHNlWmVybz86IGJvb2xlYW47XG4gIGNoYXJ0V2lkdGhQZXJjZW50YWdlOiBudW1iZXI7XG4gIHNob3dMYWJlbFByZWZpeDogYm9vbGVhbjtcbiAgZWRpdG9yOiBib29sZWFuO1xufVxuXG50eXBlIFBpZUNoYXJ0U3RhdGUgPSB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIG9uTGF5b3V0OiBib29sZWFuO1xuICBjYWxjdWxhdGluZzogQXJyYXk8YW55Pjtcbn07XG5cbmNvbnN0IGNvbXBhcmVEYXRhQXJyYXlzID0gKGEsIGIpID0+IHtcbiAgLy9UT0RPOiByZW1vdmUgdmFsdWVzIGZpZWxkIGZyb20gYSBhbmQgYlxuICAvL1RPRE86IGdldCB0aGUgc3VtIG9mIHZhbHVlcyB0byBtYWtlIHN1cmUgcGVyY2VudGFnZXMgc3RheSB0aGUgc2FtZVxuICBsZXQgc3VtQSA9IGEucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIGxldCBzdW1CID0gYi5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIChcbiAgICBzdW1BID09PSBzdW1CICYmXG4gICAgYS5sZW5ndGggPT09IGIubGVuZ3RoICYmXG4gICAgYS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBhQ29weSA9IHtcbiAgICAgICAgLi4udmFsdWUsXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGJDb3B5ID0ge1xuICAgICAgICAuLi5iW2luZGV4XSxcbiAgICAgICAgdmFsdWVzOiBudWxsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFDb3B5KSA9PT0gSlNPTi5zdHJpbmdpZnkoYkNvcHkpO1xuICAgIH0pXG4gICk7XG59O1xuXG5jbGFzcyBQaWVDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8UGllQ2hhcnRQcm9wcywgUGllQ2hhcnRTdGF0ZT4ge1xuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy53aWR0aCAhPT0gcHJldlByb3BzLndpZHRoIHx8XG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gcHJldlByb3BzLmhlaWdodCB8fFxuICAgICAgdGhpcy5wcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSAhPT0gcHJldlByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlIHx8XG4gICAgICAhY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICApIHtcbiAgICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcuZmlsdGVyKGkgPT4gaS5jYWxjdWxhdGluZyA9PT0gdHJ1ZSkubGVuZ3RoID09PVxuICAgICAgICAgIDAgJiZcbiAgICAgICAgdGhpcy5wcm9wcy53aWR0aCA9PT0gcHJldlByb3BzLndpZHRoICYmXG4gICAgICAgIC8vICF0aGlzLnByb3BzLmVkaXRvciAmJlxuICAgICAgICBjb21wYXJlRGF0YUFycmF5cyh0aGlzLnByb3BzLmRhdGEsIHByZXZQcm9wcy5kYXRhKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgIG9uTGF5b3V0OiBmYWxzZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICAgIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogdHJ1ZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzXG4gICAgICAgICAgLy8gLi4udGhpcy5zdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYWxjdWxhdGluZyxcbiAgICAgIG9uTGF5b3V0OiB0cnVlLFxuICAgICAgLi4ucHJvcHMsXG4gICAgICBsYWJlbERhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIGFic29sdXRlID0gZmFsc2UsXG4gICAgICBoYXNMZWdlbmQgPSB0cnVlLFxuICAgICAgYXZvaWRGYWxzZVplcm8gPSBmYWxzZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy9UT0RPOiBtb3ZlIHNldFN0YXRlIG91dCBvZiBvbmxheW91dCBzaW5jZSBpdCBydW5zIGluIGEgZm9yIGxvb3BcbiAgICBjb25zdCBvbkxheW91dCA9IChlLCBpbmRleCwgZm9udFNpemUsIGxhYmVsKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5vbkxheW91dCkge1xuICAgICAgICBsZXQgd2lkdGggPSBlLm5hdGl2ZUV2ZW50LmxheW91dC53aWR0aDtcbiAgICAgICAgbGV0IHRhcmdldCA9XG4gICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAtIHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSAtIDg0O1xuICAgICAgICBsZXQgY2FsY3VsYXRpbmcgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nO1xuXG4gICAgICAgIGlmICh3aWR0aCA8IHRhcmdldCkge1xuICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGxhYmVsLnNsaWNlKC0zKSA9PT0gXCIuLi5cIikge1xuICAgICAgICAgICAgbGFiZWwgPSBsYWJlbC5zbGljZSgwLCAtMyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc05hTihmb250U2l6ZSkpIHtcbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgZm9udFNpemUgPSBcIjEycHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCAtIGZvbnRTaXplLnNwbGl0KFwicFwiKVswXSAqIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCAtIGZvbnRTaXplICogMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbnVtYmVyT2ZDaGFyYWN0ZXJzID0gbGFiZWwubGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IHJhdGlvID0gdGFyZ2V0IC8gd2lkdGg7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0Q2hhcmFjdGVycyA9IE1hdGguZmxvb3IocmF0aW8gKiBudW1iZXJPZkNoYXJhY3RlcnMpO1xuICAgICAgICAgIGxhYmVsID0gYCR7bGFiZWwuc2xpY2UoMCwgdGFyZ2V0Q2hhcmFjdGVycyl9Li4uYDtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0ubGFiZWwubmFtZSA9IGxhYmVsO1xuICAgICAgICAgIGlmIChsYWJlbCA9PT0gXCIuLi5cIikge1xuICAgICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmNhbGN1bGF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgY2FsY3VsYXRpb25zID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQge1xuICAgICAgICBuYW1lLFxuICAgICAgICBsZWdlbmRGb250RmFtaWx5LFxuICAgICAgICBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgbGVnZW5kRm9udFdlaWdodCxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0gPSBpdGVtLmxhYmVsO1xuICAgICAgaWYgKGl0ZW0uY2FsY3VsYXRpbmcgJiYgdGhpcy5wcm9wcy5oYXNMZWdlbmQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpdGVtXCIsIGl0ZW0sIFwiaW5kZXhcIiwgaW5kZXgpO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hYnNvbHV0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiNTUlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc2hvd0xhYmVsUHJlZml4ID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID57YCR7dmFsdWV9ICR7bmFtZX1gfTwvTmF0aXZlVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Ly9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgYCR7dmFsdWUud2hvbGV9JSAke25hbWV9YH1cbiAgICAgICAgICAgICAgPC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCB9ID0gc3R5bGU7XG5cbiAgICBsZXQgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSB0aGlzLnByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlICogMC4wMTtcblxuICAgIGxldCByYWRpdXM6IG51bWJlcjtcblxuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41IDxcbiAgICAgICh0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UpIC8gMlxuICAgICkge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjU7XG4gICAgICBjaGFydFdpZHRoUGVyY2VudGFnZSA9IDIgKiAocmFkaXVzIC8gdGhpcy5wcm9wcy53aWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGl1cyA9IHRoaXMucHJvcHMud2lkdGggKiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLyAyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPT09IDEpIHtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMC41O1xuICAgIH1cblxuICAgIGxldCBjaGFydCA9IFBpZSh7XG4gICAgICBjZW50ZXI6IHRoaXMucHJvcHMuY2VudGVyIHx8IFswLCAwXSxcbiAgICAgIHI6IDAsXG4gICAgICBSOiByYWRpdXMsXG4gICAgICBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsXG4gICAgICBhY2Nlc3NvcjogeCA9PiB7XG4gICAgICAgIHJldHVybiB4W3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnN0YXRlLmRhdGEucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcbiAgICAgIGlmIChpc09iamVjdChpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdKSkge1xuICAgICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXS53aG9sZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0sIDApO1xuXG4gICAgbGV0IHVwcGVkSW5kaWNlcyA9IFtdO1xuXG4gICAgaWYgKCFhYnNvbHV0ZSkge1xuICAgICAgY29uc3QgZGl2aXNvciA9IHRvdGFsIC8gMTAwLjA7XG4gICAgICBsZXQgd2hvbGVUb3RhbCA9IDA7XG4gICAgICBjaGFydC5jdXJ2ZXMuZm9yRWFjaCgoYywgaSkgPT4ge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGMuaXRlbS52YWx1ZXMpKSB7XG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSAvIGRpdmlzb3I7XG4gICAgICAgICAgY29uc3QgcGllY2VzID0gcGVyY2VudGFnZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICBsZXQgd2hvbGUgPSBwYXJzZUludChwaWVjZXNbMF0pO1xuICAgICAgICAgIGxldCBkZWNpbWFsID0gcGFyc2VGbG9hdChcIi5cIiArIHBpZWNlc1sxXSk7XG4gICAgICAgICAgaWYgKGlzTmFOKGRlY2ltYWwpKSB7XG4gICAgICAgICAgICBkZWNpbWFsID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgd2hvbGVUb3RhbCArPSB3aG9sZTtcbiAgICAgICAgICAvL2hhZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGhlcmUgdG8gdXNlIGZvciBwZXJjZW50YWdlcywgY2hhcnQgd291bGRuJ3QgcmVuZGVyIHdoZW4gYXNzaWduaW5nIHRoZSBvYmplY3QgdG8gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdXG4gICAgICAgICAgYy5pdGVtLnZhbHVlcyA9IHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgd2hvbGUsXG4gICAgICAgICAgICBkZWNpbWFsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aG9sZVRvdGFsICs9IGMuaXRlbS52YWx1ZXMud2hvbGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoYW1pbHRvbkRpZmYgPSAxMDAgLSB3aG9sZVRvdGFsO1xuICAgICAgY29uc3Qgc29ydGVkQ3VydmVzID0gWy4uLmNoYXJ0LmN1cnZlc10uc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy5kZWNpbWFsIDwgYi5pdGVtLnZhbHVlcy5kZWNpbWFsID8gMSA6IC0xXG4gICAgICApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYW1pbHRvbkRpZmY7IGkrKykge1xuICAgICAgICB1cHBlZEluZGljZXMucHVzaChzb3J0ZWRDdXJ2ZXNbaV0uaXRlbS52YWx1ZXMuaW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNoYXJ0LmN1cnZlcyA9IGNoYXJ0LmN1cnZlcy5zb3J0KFxuICAgICAgICAoYSwgYikgPT4gYS5pdGVtLnZhbHVlcy53aG9sZSA+IGIuaXRlbS52YWx1ZXMud2hvbGVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnQuY3VydmVzLm1hcCgoYywgaSkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG5cbiAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXgpIHtcbiAgICAgICAgICB2YWx1ZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY2FsY3VsYXRlIHBlcmNlbnRhZ2UgdXNpbmcgSGFtaWx0b24ncyBtZXRob2RcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwICsgXCIlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGMuaXRlbS52YWx1ZXM7XG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBpdGVtLndob2xlO1xuICAgICAgICAgIGlmICh1cHBlZEluZGljZXMuaW5jbHVkZXMoaXRlbS5pbmRleCkpIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGF2b2lkRmFsc2VaZXJvICYmIGl0ZW0ud2hvbGUgPT09IDAgJiYgaXRlbS5kZWNpbWFsICE9PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiPDElXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dENvbG9yID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZ1tpXVxuICAgICAgICA/IGMuaXRlbS5sZWdlbmRGb250Q29sb3JcbiAgICAgICAgOiBcInRyYW5zcGFyZW50XCI7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgICAgPFBhdGhcbiAgICAgICAgICAgIGQ9e2Muc2VjdG9yLnBhdGgucHJpbnQoKX1cbiAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIC8vIGZpbGw9e3RleHRDb2xvcn1cbiAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgICAgd2lkdGg9ezE2fVxuICAgICAgICAgICAgICBoZWlnaHQ9ezE2fVxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICAgIHJ4PXs4fVxuICAgICAgICAgICAgICByeT17OH1cbiAgICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KSAtXG4gICAgICAgICAgICAgICAgMjRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgICAgICAgIDEyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXt0ZXh0Q29sb3J9XG4gICAgICAgICAgICAgIGZvbnRTaXplPXtjLml0ZW0ubGVnZW5kRm9udFNpemV9XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk9e2MuaXRlbS5sZWdlbmRGb250RmFtaWx5fVxuICAgICAgICAgICAgICBmb250V2VpZ2h0PXtjLml0ZW0ubGVnZW5kRm9udFdlaWdodH1cbiAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KX1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMiAqIDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Ake3ZhbHVlfSAke2MuaXRlbS5uYW1lfWB9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvRz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3sgcGFkZGluZ1JpZ2h0OiAxNiB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPXtiYWNrZ3JvdW5kQ29sb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8R1xuICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgICh0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UpIC8gMiArXG4gICAgICAgICAgICAgIE51bWJlcih0aGlzLnByb3BzLnBhZGRpbmdMZWZ0ID8gdGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA6IDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7c2xpY2VzfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHtjYWxjdWxhdGlvbnN9XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaWVDaGFydDtcbiJdfQ==
