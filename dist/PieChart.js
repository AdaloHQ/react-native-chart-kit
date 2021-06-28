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
import Pie from "paths-js/pie";
import React from "react";
import { View } from "react-native";
import { G, Path, Rect, Svg } from "react-native-svg";
import { Text } from "@visx/text";
import AbstractChart from "./AbstractChart";
var PieChart = /** @class */ (function(_super) {
  __extends(PieChart, _super);
  function PieChart() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
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
      data: this.props.data,
      accessor: function(x) {
        return x[_this.props.accessor];
      }
    });
    var total = this.props.data.reduce(function(sum, item) {
      return sum + item[_this.props.accessor];
    }, 0);
    var uppedIndices = [];
    if (!absolute) {
      var divisor_1 = total / 100.0;
      var wholeTotal_1 = 0;
      chart.curves.forEach(function(c, i) {
        var percentage = c.item[_this.props.accessor] / divisor_1;
        var pieces = percentage.toString().split(".");
        var whole = parseInt(pieces[0]);
        var decimal = parseFloat("." + pieces[1]);
        if (isNaN(decimal)) {
          decimal = 0;
        }
        wholeTotal_1 += whole;
        c.item[_this.props.accessor] = {
          index: i,
          whole: whole,
          decimal: decimal
        };
      });
      var hamiltonDiff = 100 - wholeTotal_1;
      var sortedCurves = __spreadArrays(chart.curves).sort(function(a, b) {
        return a.item[_this.props.accessor].decimal <
          b.item[_this.props.accessor].decimal
          ? 1
          : -1;
      });
      for (var i = 0; i < hamiltonDiff; i++) {
        uppedIndices.push(sortedCurves[i].item[this.props.accessor].index);
      }
    }
    var slices = chart.curves.map(function(c, i) {
      var value;
      if (absolute) {
        value = c.item[_this.props.accessor];
      } else {
        //calculate percentage using Hamilton's method
        if (total === 0) {
          value = 0 + "%";
        } else {
          var item = c.item[_this.props.accessor];
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
          />
          {hasLegend ? (
            <Rect
              width={c.item.legendFontSize}
              height={c.item.legendFontSize}
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
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              fontWeight={c.item.legendFontWeight}
              x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12 * 2
              }
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
        <Svg width={this.props.width} height={this.props.height}>
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
      </View>
    );
  };
  return PieChart;
})(AbstractChart);
export default PieChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEMsT0FBTyxhQUFxQyxNQUFNLGlCQUFpQixDQUFDO0FBbUJwRTtJQUF1Qiw0QkFBMkM7SUFBbEU7O0lBMExBLENBQUM7SUF6TEMseUJBQU0sR0FBTjtRQUFBLGlCQXdMQztRQXZMTyxJQUFBLEtBTUYsSUFBSSxDQUFDLEtBQUssRUFMWixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLEtBQUEsRUFDVixlQUFlLHFCQUFBLEVBQ2YsZ0JBQWdCLEVBQWhCLFFBQVEsbUJBQUcsS0FBSyxLQUFBLEVBQ2hCLGlCQUFnQixFQUFoQixTQUFTLG1CQUFHLElBQUksS0FBQSxFQUNoQixzQkFBc0IsRUFBdEIsY0FBYyxtQkFBRyxLQUFLLEtBQ1YsQ0FBQztRQUVQLElBQUEsS0FBcUIsS0FBSyxhQUFWLEVBQWhCLFlBQVksbUJBQUcsQ0FBQyxLQUFBLENBQVc7UUFFbkMsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUVsRSxJQUFJLE1BQWMsQ0FBQztRQUVuQixJQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUc7WUFDdkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxvQkFBb0Is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RCxDQUFDLEFBMUxELENBQXVCLGFBQWEsR0EwTG5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGllIGZyb20gXCJwYXRocy1qcy9waWVcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZyB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5pbXBvcnQgeyBUZXh0IH0gZnJvbSBcIkB2aXN4L3RleHRcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHsgQWJzdHJhY3RDaGFydFByb3BzIH0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgY2hhcnRXaWR0aFBlcmNlbnRhZ2U6IG51bWJlcjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge307XG5cbmNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxQaWVDaGFydFByb3BzLCBQaWVDaGFydFN0YXRlPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgYWJzb2x1dGUgPSBmYWxzZSxcbiAgICAgIGhhc0xlZ2VuZCA9IHRydWUsXG4gICAgICBhdm9pZEZhbHNlWmVybyA9IGZhbHNlXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAgfSA9IHN0eWxlO1xuXG4gICAgbGV0IGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gdGhpcy5wcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSAqIDAuMDE7XG5cbiAgICBsZXQgcmFkaXVzOiBudW1iZXI7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAvIDIuNSA8XG4gICAgICAodGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlKSAvIDJcbiAgICApIHtcbiAgICAgIHJhZGl1cyA9IHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41O1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAyICogKHJhZGl1cyAvIHRoaXMucHJvcHMud2lkdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLndpZHRoICogKGNoYXJ0V2lkdGhQZXJjZW50YWdlIC8gMik7XG4gICAgfVxuXG4gICAgaWYgKGNoYXJ0V2lkdGhQZXJjZW50YWdlID09PSAxKSB7XG4gICAgICBjaGFydFdpZHRoUGVyY2VudGFnZSA9IDAuNTtcbiAgICB9XG5cbiAgICBsZXQgY2hhcnQgPSBQaWUoe1xuICAgICAgY2VudGVyOiB0aGlzLnByb3BzLmNlbnRlciB8fCBbMCwgMF0sXG4gICAgICByOiAwLFxuICAgICAgUjogcmFkaXVzLFxuICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgYWNjZXNzb3I6IHggPT4ge1xuICAgICAgICByZXR1cm4geFt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5wcm9wcy5kYXRhLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICB9LCAwKTtcblxuICAgIGxldCB1cHBlZEluZGljZXMgPSBbXTtcblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNvbnN0IGRpdmlzb3IgPSB0b3RhbCAvIDEwMC4wO1xuICAgICAgbGV0IHdob2xlVG90YWwgPSAwO1xuICAgICAgY2hhcnQuY3VydmVzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSAvIGRpdmlzb3I7XG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IHBlcmNlbnRhZ2UudG9TdHJpbmcoKS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnN0IHdob2xlID0gcGFyc2VJbnQocGllY2VzWzBdKTtcbiAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgaWYgKGlzTmFOKGRlY2ltYWwpKSB7XG4gICAgICAgICAgZGVjaW1hbCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2hvbGVUb3RhbCArPSB3aG9sZTtcbiAgICAgICAgYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdID0ge1xuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIHdob2xlLFxuICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoYW1pbHRvbkRpZmYgPSAxMDAgLSB3aG9sZVRvdGFsO1xuICAgICAgY29uc3Qgc29ydGVkQ3VydmVzID0gWy4uLmNoYXJ0LmN1cnZlc10uc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLmRlY2ltYWwgPFxuICAgICAgICBiLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0uZGVjaW1hbFxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIHVwcGVkSW5kaWNlcy5wdXNoKHNvcnRlZEN1cnZlc1tpXS5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLmluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzbGljZXMgPSBjaGFydC5jdXJ2ZXMubWFwKChjLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IHN0cmluZztcblxuICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgIHZhbHVlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgcGVyY2VudGFnZSB1c2luZyBIYW1pbHRvbidzIG1ldGhvZFxuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgICAgIGxldCBwZXJjZW50YWdlID0gaXRlbS53aG9sZTtcbiAgICAgICAgICBpZiAodXBwZWRJbmRpY2VzLmluY2x1ZGVzKGl0ZW0uaW5kZXgpKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhdm9pZEZhbHNlWmVybyAmJiBpdGVtLndob2xlID09PSAwICYmIGl0ZW0uZGVjaW1hbCAhPT0gMCkge1xuICAgICAgICAgICAgdmFsdWUgPSBcIjwxJVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBlcmNlbnRhZ2UgKyBcIiVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgICAgPFBhdGhcbiAgICAgICAgICAgIGQ9e2Muc2VjdG9yLnBhdGgucHJpbnQoKX1cbiAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICBcbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBoZWlnaHQ9e2MuaXRlbS5sZWdlbmRGb250U2l6ZX1cbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0ubGVnZW5kRm9udENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMucHJvcHMuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy91bmNvbW1lbnQgdG8gd3JhcCB0ZXh0IChwb29yIGltcGxlbWVudGF0aW9uKVxuICAgICAgICAgICAgICAvLyB3aWR0aD17dGhpcy5wcm9wcy53aWR0aCAvIDIuNSAtIDE2fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YCR7dmFsdWV9ICR7Yy5pdGVtLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofSBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fT5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19
