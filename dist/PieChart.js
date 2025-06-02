var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { isObject } from "lodash";
import Pie from "paths-js/pie";
import React from "react";
import { View, Text as NativeText } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var compareDataArrays = function (a, b) {
    //TODO: remove values field from a and b
    //TODO: get the sum of values to make sure percentages stay the same
    var sumA = a.reduce(function (accumulator, item) {
        return accumulator + item.value;
    }, 0);
    var sumB = b.reduce(function (accumulator, item) {
        return accumulator + item.value;
    }, 0);
    return (sumA === sumB &&
        a.length === b.length &&
        a.every(function (value, index) {
            var aCopy = __assign(__assign({}, value), { values: null });
            var bCopy = __assign(__assign({}, b[index]), { values: null });
            return JSON.stringify(aCopy) === JSON.stringify(bCopy);
        }));
};
var PieChart = /** @class */ (function (_super) {
    __extends(PieChart, _super);
    function PieChart(props) {
        var _this = _super.call(this, props) || this;
        var calculating = [];
        for (var i = 0; i < _this.props.data.length; i++) {
            calculating[i] = { label: _this.props.data[i], calculating: true };
        }
        _this.state = __assign(__assign({ calculating: calculating, onLayout: true }, props), { labelData: _this.props.data });
        return _this;
    }
    PieChart.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.width !== prevProps.width ||
            this.props.height !== prevProps.height ||
            this.props.chartWidthPercentage !== prevProps.chartWidthPercentage ||
            !compareDataArrays(this.props.data, prevProps.data)) {
            var calculating = [];
            for (var i = 0; i < this.props.data.length; i++) {
                calculating[i] = { label: this.props.data[i], calculating: true };
            }
            if (this.state.calculating.filter(function (i) { return i.calculating === true; }).length ===
                0 &&
                this.props.width === prevProps.width &&
                // !this.props.editor &&
                compareDataArrays(this.props.data, prevProps.data)) {
                this.setState(__assign(__assign({ calculating: calculating, onLayout: false }, this.props), this.state));
            }
            else {
                this.setState(__assign({ calculating: calculating, onLayout: true }, this.props
                // ...this.state
                ));
            }
        }
    };
    PieChart.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.style, style = _b === void 0 ? {} : _b, backgroundColor = _a.backgroundColor, _c = _a.absolute, absolute = _c === void 0 ? false : _c, _d = _a.hasLegend, hasLegend = _d === void 0 ? true : _d, _e = _a.avoidFalseZero, avoidFalseZero = _e === void 0 ? false : _e;
        //TODO: move setState out of onlayout since it runs in a for loop
        var onLayout = function (e, index, fontSize, label) {
            if (_this.state.onLayout) {
                var width = e.nativeEvent.layout.width;
                var target = _this.props.width - _this.props.width * chartWidthPercentage - 84;
                var calculating = _this.state.calculating;
                if (width < target) {
                    calculating[index].calculating = false;
                    _this.setState(__assign({ calculating: calculating }, _this.state));
                }
                else {
                    if (label.slice(-3) === "...") {
                        label = label.slice(0, -3);
                    }
                    if (isNaN(fontSize)) {
                        if (!fontSize) {
                            fontSize = "12px";
                        }
                        target = target - fontSize.split("p")[0] * 2;
                    }
                    else {
                        target = target - fontSize * 2;
                    }
                    var numberOfCharacters = label.length;
                    var ratio = target / width;
                    var targetCharacters = Math.floor(ratio * numberOfCharacters);
                    label = "".concat(label.slice(0, targetCharacters), "...");
                    calculating[index].label.name = label;
                    if (label === "...") {
                        calculating[index].calculating = false;
                    }
                    _this.setState(__assign({ calculating: calculating }, _this.state));
                }
            }
        };
        var calculations = this.state.calculating.map(function (item, index) {
            var _a = item.label, name = _a.name, legendFontFamily = _a.legendFontFamily, legendFontSize = _a.legendFontSize, legendFontWeight = _a.legendFontWeight, value = _a.value;
            if (item.calculating && _this.props.hasLegend) {
                if (_this.props.absolute === false) {
                    value = "55%";
                }
                if (_this.props.showLabelPrefix === false) {
                    value = "";
                }
                if (!isObject(value)) {
                    return (<View key={index} style={{ alignSelf: "flex-start", position: "absolute" }} onLayout={function (e) { return onLayout(e, index, legendFontSize, name); }}>
              <NativeText style={{
                            fontFamily: legendFontFamily,
                            fontSize: legendFontSize,
                            fontWeight: legendFontWeight,
                            color: "transparent"
                        }}>{"".concat(value, " ").concat(name)}</NativeText>
            </View>);
                }
                else {
                    return (<View key={index} style={{ alignSelf: "flex-start", position: "absolute" }} onLayout={function (e) { return onLayout(e, index, legendFontSize, name); }}>
              <NativeText style={{
                            fontFamily: legendFontFamily,
                            fontSize: legendFontSize,
                            fontWeight: legendFontWeight,
                            color: "transparent"
                        }}>
                {//@ts-ignore
                        "".concat(value.whole, "% ").concat(name)}
              </NativeText>
            </View>);
                }
            }
        });
        var _f = style.borderRadius, borderRadius = _f === void 0 ? 0 : _f;
        var chartWidthPercentage = this.props.chartWidthPercentage * 0.01;
        var radius;
        if (this.props.height / 2.5 <
            (this.props.width * chartWidthPercentage) / 2) {
            radius = this.props.height / 2.5;
            chartWidthPercentage = 2 * (radius / this.props.width);
        }
        else {
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
            accessor: function (x) {
                return x[_this.props.accessor];
            }
        });
        var total = this.state.data.reduce(function (sum, item) {
            if (isObject(item[_this.props.accessor])) {
                return sum + item[_this.props.accessor].whole;
            }
            else {
                return sum + item[_this.props.accessor];
            }
        }, 0);
        var uppedIndices = [];
        if (!absolute) {
            var divisor_1 = total / 100.0;
            var wholeTotal_1 = 0;
            chart.curves.forEach(function (c, i) {
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
                }
                else {
                    wholeTotal_1 += c.item.values.whole;
                }
            });
            var hamiltonDiff = 100 - wholeTotal_1;
            var sortedCurves = __spreadArray([], chart.curves, true).sort(function (a, b) {
                return a.item.values.decimal < b.item.values.decimal ? 1 : -1;
            });
            var _loop_1 = function (i) {
                var uppedVal = sortedCurves[i].item.values.whole;
                sortedCurves.some(function (item) {
                    if (item.item.values.whole === uppedVal) {
                        uppedIndices.push(item.item.values.index);
                        chart.curves[item.item.values.index].item.values.whole += 1;
                        return true;
                    }
                });
            };
            for (var i = 0; i < hamiltonDiff; i++) {
                _loop_1(i);
            }
        }
        var chartCurvesSorted = __spreadArray([], chart.curves, true).filter(function (item) { return item.item.otherSlice !== true; });
        var otherSlice = __spreadArray([], chart.curves, true).find(function (item) { return item.item.otherSlice === true; });
        if (!absolute) {
            chartCurvesSorted = chartCurvesSorted.sort(function (a, b) {
                return a.item.values.whole < b.item.values.whole ? 1 : -1;
            });
        }
        if (otherSlice) {
            chartCurvesSorted.push(otherSlice);
        }
        var slices = chartCurvesSorted.map(function (c, i) {
            var value;
            if (absolute) {
                if (_this.props.showLabelPrefix) {
                    value = c.item[_this.props.accessor];
                }
                else {
                    value = "";
                }
            }
            else {
                //calculate percentage using Hamilton's method
                if (total === 0) {
                    value = 0 + "%";
                }
                else {
                    var item = c.item.values;
                    var percentage = item.whole;
                    // if (uppedIndices.includes(item.index)) {
                    //   percentage += 1;
                    // }
                    if (avoidFalseZero && item.whole === 0 && item.decimal !== 0) {
                        value = "<1%";
                    }
                    else {
                        value = percentage + "%";
                    }
                }
            }
            var textColor = _this.state.calculating[i]
                ? c.item.legendFontColor
                : "transparent";
            return (<G key={Math.random()}>
          <Path d={c.sector.path.print()} fill={c.item.color} 
            // fill={textColor}
            onPress={c.item.action} 
            //@ts-ignore
            onClick={c.item.action}/>
          {hasLegend ? (<Rect width={16} height={16} fill={c.item.color} rx={8} ry={8} x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
                        24} y={-(_this.props.height / 2.5) +
                        ((_this.props.height * 0.8) / _this.state.data.length) * i +
                        12} onPress={c.item.action} 
                //@ts-ignore
                onClick={c.item.action}/>) : null}
          {hasLegend ? (<Text fill={textColor} fontSize={c.item.legendFontSize} fontFamily={c.item.legendFontFamily} fontWeight={c.item.legendFontWeight} x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5)} y={-(_this.props.height / 2.5) +
                        ((_this.props.height * 0.8) / _this.state.data.length) * i +
                        12 * 2} onPress={c.item.action} 
                //@ts-ignore
                onClick={c.item.action}>
              {"".concat(value, " ").concat(c.item.name)}
            </Text>) : null}
        </G>);
        });
        return (<View style={__assign({ width: this.props.width, height: this.props.height, padding: 0 }, style)}>
        <Svg width={this.props.width} height={this.props.height} style={{ paddingRight: 16 }}>
          <G>
            {this.renderDefs(__assign({ width: this.props.height, height: this.props.height }, this.props.chartConfig))}
          </G>
          <Rect width="100%" height={this.props.height} rx={Number(borderRadius)} ry={Number(borderRadius)} fill={backgroundColor}/>
          <G x={(this.props.width * chartWidthPercentage) / 2 +
                Number(this.props.paddingLeft ? this.props.paddingLeft : 0)} y={this.props.height / 2} width={this.props.width}>
            {slices}
          </G>
        </Svg>
        {calculations}
      </View>);
    };
    return PieChart;
}(AbstractChart));
export default PieChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFhLElBQUksSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBQXFDLE1BQU0saUJBQWlCLENBQUM7QUEwQnBFLElBQU0saUJBQWlCLEdBQUcsVUFBQyxDQUFDLEVBQUUsQ0FBQztJQUM3Qix3Q0FBd0M7SUFDeEMsb0VBQW9FO0lBQ3BFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsSUFBSTtRQUNwQyxPQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVOLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsSUFBSTtRQUNwQyxPQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVOLE9BQU8sQ0FDTCxJQUFJLEtBQUssSUFBSTtRQUNiLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU07UUFDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO1lBQ25CLElBQU0sS0FBSyx5QkFDTixLQUFL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LENBQUMsV0FBVyxFQUN6QixDQUNKO1VBQUEsRUFBRSxDQUFDLENBQ0g7VUFBQSxDQUFDLElBQUksQ0FDSCxLQUFLLENBQUMsTUFBTSxDQUNaLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQzFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUN6QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FDekIsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEVBRXhCO1VBQUEsQ0FBQyxDQUFDLENBQ0EsQ0FBQyxDQUFDLENBQ0EsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FBQyxDQUNELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUN6QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUV4QjtZQUFBLENBQUMsTUFBTSxDQUNUO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxDQUNmO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBOVhELENBQXVCLGFBQWEsR0E4WG5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xuaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUsIFRleHQgYXMgTmF0aXZlVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZywgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbi8vIGltcG9ydCBUZXh0V2lkdGhGaW5kZXIgZnJvbSBcIi4vVGV4dFdpZHRoRmluZGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhY2Nlc3Nvcjogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgYXZvaWRGYWxzZVplcm8/OiBib29sZWFuO1xuICBjaGFydFdpZHRoUGVyY2VudGFnZTogbnVtYmVyO1xuICBzaG93TGFiZWxQcmVmaXg6IGJvb2xlYW47XG4gIGVkaXRvcjogYm9vbGVhbjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICBvbkxheW91dDogYm9vbGVhbjtcbiAgY2FsY3VsYXRpbmc6IEFycmF5PGFueT47XG59O1xuXG5jb25zdCBjb21wYXJlRGF0YUFycmF5cyA9IChhLCBiKSA9PiB7XG4gIC8vVE9ETzogcmVtb3ZlIHZhbHVlcyBmaWVsZCBmcm9tIGEgYW5kIGJcbiAgLy9UT0RPOiBnZXQgdGhlIHN1bSBvZiB2YWx1ZXMgdG8gbWFrZSBzdXJlIHBlcmNlbnRhZ2VzIHN0YXkgdGhlIHNhbWVcbiAgbGV0IHN1bUEgPSBhLnJlZHVjZSgoYWNjdW11bGF0b3IsIGl0ZW0pID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBpdGVtLnZhbHVlO1xuICB9LCAwKTtcblxuICBsZXQgc3VtQiA9IGIucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIHJldHVybiAoXG4gICAgc3VtQSA9PT0gc3VtQiAmJlxuICAgIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJlxuICAgIGEuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgYUNvcHkgPSB7XG4gICAgICAgIC4uLnZhbHVlLFxuICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgIH07XG4gICAgICBjb25zdCBiQ29weSA9IHtcbiAgICAgICAgLi4uYltpbmRleF0sXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhQ29weSkgPT09IEpTT04uc3RyaW5naWZ5KGJDb3B5KTtcbiAgICB9KVxuICApO1xufTtcblxuY2xhc3MgUGllQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFBpZUNoYXJ0UHJvcHMsIFBpZUNoYXJ0U3RhdGU+IHtcbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgIT09IHByZXZQcm9wcy5oZWlnaHQgfHxcbiAgICAgIHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgIT09IHByZXZQcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSB8fFxuICAgICAgIWNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgKSB7XG4gICAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLmZpbHRlcihpID0+IGkuY2FsY3VsYXRpbmcgPT09IHRydWUpLmxlbmd0aCA9PT1cbiAgICAgICAgICAwICYmXG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggPT09IHByZXZQcm9wcy53aWR0aCAmJlxuICAgICAgICAvLyAhdGhpcy5wcm9wcy5lZGl0b3IgJiZcbiAgICAgICAgY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogZmFsc2UsXG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAgICAgLi4udGhpcy5wcm9wc1xuICAgICAgICAgIC8vIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICBvbkxheW91dDogdHJ1ZSxcbiAgICAgIC4uLnByb3BzLFxuICAgICAgbGFiZWxEYXRhOiB0aGlzLnByb3BzLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gZmFsc2VcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vVE9ETzogbW92ZSBzZXRTdGF0ZSBvdXQgb2Ygb25sYXlvdXQgc2luY2UgaXQgcnVucyBpbiBhIGZvciBsb29wXG4gICAgY29uc3Qgb25MYXlvdXQgPSAoZSwgaW5kZXgsIGZvbnRTaXplLCBsYWJlbCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUub25MYXlvdXQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZS5uYXRpdmVFdmVudC5sYXlvdXQud2lkdGg7XG4gICAgICAgIGxldCB0YXJnZXQgPVxuICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLSB0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLSA4NDtcbiAgICAgICAgbGV0IGNhbGN1bGF0aW5nID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZztcblxuICAgICAgICBpZiAod2lkdGggPCB0YXJnZXQpIHtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYWJlbC5zbGljZSgtMykgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFiZWwuc2xpY2UoMCwgLTMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNOYU4oZm9udFNpemUpKSB7XG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgIGZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZS5zcGxpdChcInBcIilbMF0gKiAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZSAqIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG51bWJlck9mQ2hhcmFjdGVycyA9IGxhYmVsLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByYXRpbyA9IHRhcmdldCAvIHdpZHRoO1xuICAgICAgICAgIGNvbnN0IHRhcmdldENoYXJhY3RlcnMgPSBNYXRoLmZsb29yKHJhdGlvICogbnVtYmVyT2ZDaGFyYWN0ZXJzKTtcbiAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsLnNsaWNlKDAsIHRhcmdldENoYXJhY3RlcnMpfS4uLmA7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmxhYmVsLm5hbWUgPSBsYWJlbDtcbiAgICAgICAgICBpZiAobGFiZWwgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFic29sdXRlID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCI1NSVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXggPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMuc3RhdGUuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIGxldCB1cHBlZFZhbCA9IHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgc29ydGVkQ3VydmVzLnNvbWUoaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uaXRlbS52YWx1ZXMud2hvbGUgPT09IHVwcGVkVmFsKSB7XG4gICAgICAgICAgICB1cHBlZEluZGljZXMucHVzaChpdGVtLml0ZW0udmFsdWVzLmluZGV4KTtcbiAgICAgICAgICAgIGNoYXJ0LmN1cnZlc1tpdGVtLml0ZW0udmFsdWVzLmluZGV4XS5pdGVtLnZhbHVlcy53aG9sZSArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hhcnRDdXJ2ZXNTb3J0ZWQgPSBbLi4uY2hhcnQuY3VydmVzXS5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlICE9PSB0cnVlXG4gICAgKTtcbiAgICBsZXQgb3RoZXJTbGljZSA9IFsuLi5jaGFydC5jdXJ2ZXNdLmZpbmQoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlID09PSB0cnVlXG4gICAgKTtcblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkID0gY2hhcnRDdXJ2ZXNTb3J0ZWQuc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy53aG9sZSA8IGIuaXRlbS52YWx1ZXMud2hvbGUgPyAxIDogLTFcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG90aGVyU2xpY2UpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkLnB1c2gob3RoZXJTbGljZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnRDdXJ2ZXNTb3J0ZWQubWFwKChjLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IHN0cmluZztcblxuICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCkge1xuICAgICAgICAgIHZhbHVlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgcGVyY2VudGFnZSB1c2luZyBIYW1pbHRvbidzIG1ldGhvZFxuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYy5pdGVtLnZhbHVlcztcbiAgICAgICAgICBsZXQgcGVyY2VudGFnZSA9IGl0ZW0ud2hvbGU7XG4gICAgICAgICAgLy8gaWYgKHVwcGVkSW5kaWNlcy5pbmNsdWRlcyhpdGVtLmluZGV4KSkge1xuICAgICAgICAgIC8vICAgcGVyY2VudGFnZSArPSAxO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgICBpZiAoYXZvaWRGYWxzZVplcm8gJiYgaXRlbS53aG9sZSA9PT0gMCAmJiBpdGVtLmRlY2ltYWwgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBwZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2ldXG4gICAgICAgID8gYy5pdGVtLmxlZ2VuZEZvbnRDb2xvclxuICAgICAgICA6IFwidHJhbnNwYXJlbnRcIjtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgZD17Yy5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgLy8gZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD17MTZ9XG4gICAgICAgICAgICAgIGhlaWdodD17MTZ9XG4gICAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgICAgcng9ezh9XG4gICAgICAgICAgICAgIHJ5PXs4fVxuICAgICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLndpZHRoIC8gKDEwMCAvIChjaGFydFdpZHRoUGVyY2VudGFnZSAqIDEwMCkgKyAwLjUpIC1cbiAgICAgICAgICAgICAgICAyNFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2hhc0xlZ2VuZCA/IChcbiAgICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICAgIGZpbGw9e3RleHRDb2xvcn1cbiAgICAgICAgICAgICAgZm9udFNpemU9e2MuaXRlbS5sZWdlbmRGb250U2l6ZX1cbiAgICAgICAgICAgICAgZm9udEZhbWlseT17Yy5pdGVtLmxlZ2VuZEZvbnRGYW1pbHl9XG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ9e2MuaXRlbS5sZWdlbmRGb250V2VpZ2h0fVxuICAgICAgICAgICAgICB4PXt0aGlzLnByb3BzLndpZHRoIC8gKDEwMCAvIChjaGFydFdpZHRoUGVyY2VudGFnZSAqIDEwMCkgKyAwLjUpfVxuICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgICAgICAgIDEyICogMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YCR7dmFsdWV9ICR7Yy5pdGVtLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDE2IH19XG4gICAgICAgID5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17TnVtYmVyKGJvcmRlclJhZGl1cyl9XG4gICAgICAgICAgICByeT17TnVtYmVyKGJvcmRlclJhZGl1cyl9XG4gICAgICAgICAgICBmaWxsPXtiYWNrZ3JvdW5kQ29sb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8R1xuICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgICh0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UpIC8gMiArXG4gICAgICAgICAgICAgIE51bWJlcih0aGlzLnByb3BzLnBhZGRpbmdMZWZ0ID8gdGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA6IDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XG4gICAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7c2xpY2VzfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHtjYWxjdWxhdGlvbnN9XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaWVDaGFydDtcbiJdfQ==