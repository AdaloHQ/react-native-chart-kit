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
var PieChart = /** @class */ (function(_super) {
  __extends(PieChart, _super);
  function PieChart(props) {
    var _this = this;
    console.log("constructor");
    _this = _super.call(this, props) || this;
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
      this.props.data != prevProps.data
    ) {
      var calculating = [];
      for (var i = 0; i < this.props.data.length; i++) {
        calculating[i] = { label: this.props.data[i], calculating: true };
      }
      // this.setState({
      //   calculating,
      //   onLayout: true,
      //   ...this.props,
      // })
      if (
        this.state.calculating.filter(function(i) {
          return i.calculating === true;
        }).length === 0 &&
        this.props.width === prevProps.width &&
        !this.props.editor
      ) {
        console.log("same", this.state);
        this.setState(
          __assign(
            __assign({ calculating: calculating, onLayout: false }, this.props),
            this.state
          )
        );
      } else {
        console.log(
          "this",
          this.props.width,
          "prev",
          prevProps.width,
          this.props.width === prevProps.width
        );
        console.log(
          this.state.calculating.filter(function(i) {
            return i.calculating === true;
          })
        );
        console.log(
          this.state.calculating.filter(function(i) {
            return i.calculating === true;
          }).length === 0 &&
            this.props.width !== prevProps.width &&
            this.props.width === prevProps.width
        );
        console.log("diff", this.state);
        this.setState(
          __assign({ calculating: calculating, onLayout: true }, this.props)
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
      console.log("onlayout", _this.state.onLayout);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQW1CLE1BQU0sT0FBTyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQWEsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQTBCcEU7SUFBdUIsNEJBQTJDO0lBd0NoRSxrQkFBWSxLQUFLO1FBQWpCLGlCQWNDO1FBYkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUMxQixRQUFBLGtCQUFNLEtBQUssQ0FBQyxTQUFDO1FBQ2IsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNuRTtRQUVELEtBQUksQ0FBQyxLQUFLLHVCQUNSLFdBQVcsYUFBQSxFQUNYLFFBQVEsRUFBRSxJQUFJLElBQ1gsS0FBSyxLQUNSLFNBQVMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUks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Q0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBRXhCO1lBQUEsQ0FBQyxNQUFNLENBQ1Q7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxZQUFZLENBQ2Y7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF0V0QsQ0FBdUIsYUFBYSxHQXNXbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XG5pbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSwgVGV4dCBhcyBOYXRpdmVUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHsgQWJzdHJhY3RDaGFydFByb3BzIH0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuLy8gaW1wb3J0IFRleHRXaWR0aEZpbmRlciBmcm9tIFwiLi9UZXh0V2lkdGhGaW5kZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQaWVDaGFydFByb3BzIGV4dGVuZHMgQWJzdHJhY3RDaGFydFByb3BzIHtcbiAgZGF0YTogQXJyYXk8YW55PjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGFjY2Vzc29yOiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xuICBwYWRkaW5nTGVmdDogc3RyaW5nO1xuICBjZW50ZXI/OiBBcnJheTxudW1iZXI+O1xuICBhYnNvbHV0ZT86IGJvb2xlYW47XG4gIGhhc0xlZ2VuZD86IGJvb2xlYW47XG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xuICBhdm9pZEZhbHNlWmVybz86IGJvb2xlYW47XG4gIGNoYXJ0V2lkdGhQZXJjZW50YWdlOiBudW1iZXI7XG4gIHNob3dMYWJlbFByZWZpeDogYm9vbGVhbjtcbiAgZWRpdG9yOiBib29sZWFuO1xufVxuXG50eXBlIFBpZUNoYXJ0U3RhdGUgPSB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIG9uTGF5b3V0OiBib29sZWFuO1xuICBjYWxjdWxhdGluZzogQXJyYXk8YW55Pjtcbn07XG5cbmNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxQaWVDaGFydFByb3BzLCBQaWVDaGFydFN0YXRlPiB7XG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLndpZHRoICE9PSBwcmV2UHJvcHMud2lkdGggfHxcbiAgICAgIHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgIT09IHByZXZQcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSB8fFxuICAgICAgdGhpcy5wcm9wcy5kYXRhICE9IHByZXZQcm9wcy5kYXRhXG4gICAgKSB7XG4gICAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAvLyAgIGNhbGN1bGF0aW5nLFxuICAgICAgLy8gICBvbkxheW91dDogdHJ1ZSxcbiAgICAgIC8vICAgLi4udGhpcy5wcm9wcyxcbiAgICAgIC8vIH0pXG4gICAgICBpZiAodGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5maWx0ZXIoaSA9PiBpLmNhbGN1bGF0aW5nID09PSB0cnVlKS5sZW5ndGggPT09IDAgJiYgdGhpcy5wcm9wcy53aWR0aCA9PT0gcHJldlByb3BzLndpZHRoICYmICF0aGlzLnByb3BzLmVkaXRvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnc2FtZScsIHRoaXMuc3RhdGUpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgIG9uTGF5b3V0OiBmYWxzZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICAgIC4uLnRoaXMuc3RhdGUsXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygndGhpcycsIHRoaXMucHJvcHMud2lkdGgsICdwcmV2JywgcHJldlByb3BzLndpZHRoLCB0aGlzLnByb3BzLndpZHRoID09PSBwcmV2UHJvcHMud2lkdGgpXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcuZmlsdGVyKGkgPT4gaS5jYWxjdWxhdGluZyA9PT0gdHJ1ZSkpXG4gICAgICAgIGNvbnNvbGUubG9nKCh0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLmZpbHRlcihpID0+IGkuY2FsY3VsYXRpbmcgPT09IHRydWUpLmxlbmd0aCA9PT0gMCkgJiYgdGhpcy5wcm9wcy53aWR0aCAhPT0gcHJldlByb3BzLndpZHRoICYmIHRoaXMucHJvcHMud2lkdGggPT09IHByZXZQcm9wcy53aWR0aClcbiAgICAgICAgY29uc29sZS5sb2coJ2RpZmYnLCB0aGlzLnN0YXRlKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogdHJ1ZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICAgIC8vIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbnN0cnVjdG9yJylcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYWxjdWxhdGluZyxcbiAgICAgIG9uTGF5b3V0OiB0cnVlLFxuICAgICAgLi4ucHJvcHMsXG4gICAgICBsYWJlbERhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIGFic29sdXRlID0gZmFsc2UsXG4gICAgICBoYXNMZWdlbmQgPSB0cnVlLFxuICAgICAgYXZvaWRGYWxzZVplcm8gPSBmYWxzZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qgb25MYXlvdXQgPSAoZSwgaW5kZXgsIGZvbnRTaXplLCBsYWJlbCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ29ubGF5b3V0JywgdGhpcy5zdGF0ZS5vbkxheW91dClcbiAgICAgIGlmICh0aGlzLnN0YXRlLm9uTGF5b3V0KSB7XG4gICAgICAgIGxldCB3aWR0aCA9IGUubmF0aXZlRXZlbnQubGF5b3V0LndpZHRoO1xuICAgICAgICBsZXQgdGFyZ2V0ID1cbiAgICAgICAgICB0aGlzLnByb3BzLndpZHRoIC0gdGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlIC0gODQ7XG4gICAgICAgIGxldCBjYWxjdWxhdGluZyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmc7XG4gIFxuICAgICAgICBpZiAod2lkdGggPCB0YXJnZXQpIHtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYWJlbC5zbGljZSgtMykgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFiZWwuc2xpY2UoMCwgLTMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNOYU4oZm9udFNpemUpKSB7XG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgIGZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZS5zcGxpdChcInBcIilbMF0gKiAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZSAqIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG51bWJlck9mQ2hhcmFjdGVycyA9IGxhYmVsLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByYXRpbyA9IHRhcmdldCAvIHdpZHRoO1xuICAgICAgICAgIGNvbnN0IHRhcmdldENoYXJhY3RlcnMgPSBNYXRoLmZsb29yKHJhdGlvICogbnVtYmVyT2ZDaGFyYWN0ZXJzKTtcbiAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsLnNsaWNlKDAsIHRhcmdldENoYXJhY3RlcnMpfS4uLmA7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmxhYmVsLm5hbWUgPSBsYWJlbDtcbiAgICAgICAgICBpZiAobGFiZWwgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMucHJvcHMuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIHVwcGVkSW5kaWNlcy5wdXNoKHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy5pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnQuY3VydmVzLm1hcCgoYywgaSkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG5cbiAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXgpIHtcbiAgICAgICAgICB2YWx1ZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY2FsY3VsYXRlIHBlcmNlbnRhZ2UgdXNpbmcgSGFtaWx0b24ncyBtZXRob2RcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwICsgXCIlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGMuaXRlbS52YWx1ZXM7XG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBpdGVtLndob2xlO1xuICAgICAgICAgIGlmICh1cHBlZEluZGljZXMuaW5jbHVkZXMoaXRlbS5pbmRleCkpIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGF2b2lkRmFsc2VaZXJvICYmIGl0ZW0ud2hvbGUgPT09IDAgJiYgaXRlbS5kZWNpbWFsICE9PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiPDElXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxuICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICBkPXtjLnNlY3Rvci5wYXRoLnByaW50KCl9XG4gICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2hhc0xlZ2VuZCA/IChcbiAgICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICAgIHdpZHRoPXsxNn1cbiAgICAgICAgICAgICAgaGVpZ2h0PXsxNn1cbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgZmlsbD17XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jYWxjdWxhdGluZ1tpXS5jYWxjdWxhdGluZyAmJiAhdGhpcy5wcm9wcy5lZGl0b3JcbiAgICAgICAgICAgICAgICAgID8gXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgICA6IGMuaXRlbS5sZWdlbmRGb250Q29sb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMucHJvcHMuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtgJHt2YWx1ZX0gJHt0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2MuaW5kZXhdLmxhYmVsLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDE2IH19XG4gICAgICAgID5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgICAge2NhbGN1bGF0aW9uc31cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19
