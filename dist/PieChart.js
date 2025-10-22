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
import { hslToRgba } from "./Utils";
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
                compareDataArrays(this.props.data, prevProps.data)) {
                this.setState(__assign(__assign({ calculating: calculating, onLayout: false }, this.props), this.state));
            }
            else {
                this.setState(__assign({ calculating: calculating, onLayout: true }, this.props));
            }
        }
    };
    PieChart.prototype.render = function () {
        var _this = this;
        console.error('CHARTS PieChart render');
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
            var _a;
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
            if (typeof ((_a = c === null || c === void 0 ? void 0 : c.item) === null || _a === void 0 ? void 0 : _a.color) === "string" && c.item.color.includes('hsl')) {
                c.item.color = hslToRgba(c.item.color);
            }
            return (<G key={Math.random()}>
          <Path d={c.sector.path.print()} fill={c.item.color} 
            // fill={textColor}
            onPress={c.item.action} 
            //@ts-ignore
            onClick={c.item.action}/>
          {hasLegend ? (<Rect width={16} height={16} fill={c.item.color} rx={Number(8)} ry={Number(8)} x={_this.props.width / (100 / (chartWidthPercentage * 100) + 0.5) -
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
        console.error('CHARTS PieChart this.props :', this.props);
        console.error('CHARTS PieChart chartWidthPercentage :', chartWidthPercentage);
        console.error('CHARTS PieChart this.props.chartConfig :', this.props.chartConfig);
        console.error('CHARTS PieChart this.props :', this.props);
        return (<View style={__assign({ width: this.props.width, height: this.props.height, padding: 0 }, style)}>
        <Svg width={this.props.width} height={this.props.height} style={{ paddingRight: 16 }}>
          <G>
            {this.renderDefs(__assign({ width: this.props.width, height: this.props.height }, this.props.chartConfig))}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFhLElBQUksSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBQXFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQXlCcEMsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMs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LE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FBQyxDQUNELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUN6QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUV4QjtZQUFBLENBQUMsTUFBTSxDQUNUO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxDQUNmO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBcllELENBQXVCLGFBQWEsR0FxWW5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xuaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUsIFRleHQgYXMgTmF0aXZlVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZywgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IGhzbFRvUmdiYSB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhY2Nlc3Nvcjogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgYXZvaWRGYWxzZVplcm8/OiBib29sZWFuO1xuICBjaGFydFdpZHRoUGVyY2VudGFnZTogbnVtYmVyO1xuICBzaG93TGFiZWxQcmVmaXg6IGJvb2xlYW47XG4gIGVkaXRvcjogYm9vbGVhbjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICBvbkxheW91dDogYm9vbGVhbjtcbiAgY2FsY3VsYXRpbmc6IEFycmF5PGFueT47XG59O1xuXG5jb25zdCBjb21wYXJlRGF0YUFycmF5cyA9IChhLCBiKSA9PiB7XG4gIC8vVE9ETzogcmVtb3ZlIHZhbHVlcyBmaWVsZCBmcm9tIGEgYW5kIGJcbiAgLy9UT0RPOiBnZXQgdGhlIHN1bSBvZiB2YWx1ZXMgdG8gbWFrZSBzdXJlIHBlcmNlbnRhZ2VzIHN0YXkgdGhlIHNhbWVcbiAgbGV0IHN1bUEgPSBhLnJlZHVjZSgoYWNjdW11bGF0b3IsIGl0ZW0pID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBpdGVtLnZhbHVlO1xuICB9LCAwKTtcblxuICBsZXQgc3VtQiA9IGIucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIHJldHVybiAoXG4gICAgc3VtQSA9PT0gc3VtQiAmJlxuICAgIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJlxuICAgIGEuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgYUNvcHkgPSB7XG4gICAgICAgIC4uLnZhbHVlLFxuICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgIH07XG4gICAgICBjb25zdCBiQ29weSA9IHtcbiAgICAgICAgLi4uYltpbmRleF0sXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhQ29weSkgPT09IEpTT04uc3RyaW5naWZ5KGJDb3B5KTtcbiAgICB9KVxuICApO1xufTtcblxuY2xhc3MgUGllQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFBpZUNoYXJ0UHJvcHMsIFBpZUNoYXJ0U3RhdGU+IHtcbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMud2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgIT09IHByZXZQcm9wcy5oZWlnaHQgfHxcbiAgICAgIHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgIT09IHByZXZQcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSB8fFxuICAgICAgIWNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgKSB7XG4gICAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGN1bGF0aW5nW2ldID0geyBsYWJlbDogdGhpcy5wcm9wcy5kYXRhW2ldLCBjYWxjdWxhdGluZzogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLmZpbHRlcihpID0+IGkuY2FsY3VsYXRpbmcgPT09IHRydWUpLmxlbmd0aCA9PT1cbiAgICAgICAgICAwICYmXG4gICAgICAgIHRoaXMucHJvcHMud2lkdGggPT09IHByZXZQcm9wcy53aWR0aCAmJlxuICAgICAgICBjb21wYXJlRGF0YUFycmF5cyh0aGlzLnByb3BzLmRhdGEsIHByZXZQcm9wcy5kYXRhKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgIG9uTGF5b3V0OiBmYWxzZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICAgIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICBvbkxheW91dDogdHJ1ZSxcbiAgICAgICAgICAuLi50aGlzLnByb3BzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYWxjdWxhdGluZ1tpXSA9IHsgbGFiZWw6IHRoaXMucHJvcHMuZGF0YVtpXSwgY2FsY3VsYXRpbmc6IHRydWUgfTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGxhYmVsRGF0YTogdGhpcy5wcm9wcy5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zb2xlLmVycm9yKCdDSEFSVFMgUGllQ2hhcnQgcmVuZGVyJylcblxuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gZmFsc2VcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vVE9ETzogbW92ZSBzZXRTdGF0ZSBvdXQgb2Ygb25sYXlvdXQgc2luY2UgaXQgcnVucyBpbiBhIGZvciBsb29wXG4gICAgY29uc3Qgb25MYXlvdXQgPSAoZSwgaW5kZXgsIGZvbnRTaXplLCBsYWJlbCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUub25MYXlvdXQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZS5uYXRpdmVFdmVudC5sYXlvdXQud2lkdGg7XG4gICAgICAgIGxldCB0YXJnZXQgPVxuICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLSB0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLSA4NDtcbiAgICAgICAgbGV0IGNhbGN1bGF0aW5nID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZztcblxuICAgICAgICBpZiAod2lkdGggPCB0YXJnZXQpIHtcbiAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChsYWJlbC5zbGljZSgtMykgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFiZWwuc2xpY2UoMCwgLTMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNOYU4oZm9udFNpemUpKSB7XG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgIGZvbnRTaXplID0gXCIxMnB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZS5zcGxpdChcInBcIilbMF0gKiAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgLSBmb250U2l6ZSAqIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG51bWJlck9mQ2hhcmFjdGVycyA9IGxhYmVsLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByYXRpbyA9IHRhcmdldCAvIHdpZHRoO1xuICAgICAgICAgIGNvbnN0IHRhcmdldENoYXJhY3RlcnMgPSBNYXRoLmZsb29yKHJhdGlvICogbnVtYmVyT2ZDaGFyYWN0ZXJzKTtcbiAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsLnNsaWNlKDAsIHRhcmdldENoYXJhY3RlcnMpfS4uLmA7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmxhYmVsLm5hbWUgPSBsYWJlbDtcbiAgICAgICAgICBpZiAobGFiZWwgPT09IFwiLi4uXCIpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5jYWxjdWxhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFic29sdXRlID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCI1NSVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXggPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgICAgb25MYXlvdXQ9e2UgPT4gb25MYXlvdXQoZSwgaW5kZXgsIGxlZ2VuZEZvbnRTaXplLCBuYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMuc3RhdGUuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIGxldCB1cHBlZFZhbCA9IHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgc29ydGVkQ3VydmVzLnNvbWUoaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uaXRlbS52YWx1ZXMud2hvbGUgPT09IHVwcGVkVmFsKSB7XG4gICAgICAgICAgICB1cHBlZEluZGljZXMucHVzaChpdGVtLml0ZW0udmFsdWVzLmluZGV4KTtcbiAgICAgICAgICAgIGNoYXJ0LmN1cnZlc1tpdGVtLml0ZW0udmFsdWVzLmluZGV4XS5pdGVtLnZhbHVlcy53aG9sZSArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hhcnRDdXJ2ZXNTb3J0ZWQgPSBbLi4uY2hhcnQuY3VydmVzXS5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlICE9PSB0cnVlXG4gICAgKTtcbiAgICBsZXQgb3RoZXJTbGljZSA9IFsuLi5jaGFydC5jdXJ2ZXNdLmZpbmQoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlID09PSB0cnVlXG4gICAgKTtcblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkID0gY2hhcnRDdXJ2ZXNTb3J0ZWQuc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy53aG9sZSA8IGIuaXRlbS52YWx1ZXMud2hvbGUgPyAxIDogLTFcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG90aGVyU2xpY2UpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkLnB1c2gob3RoZXJTbGljZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnRDdXJ2ZXNTb3J0ZWQubWFwKChjLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IHN0cmluZztcblxuICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCkge1xuICAgICAgICAgIHZhbHVlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgcGVyY2VudGFnZSB1c2luZyBIYW1pbHRvbidzIG1ldGhvZFxuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYy5pdGVtLnZhbHVlcztcbiAgICAgICAgICBsZXQgcGVyY2VudGFnZSA9IGl0ZW0ud2hvbGU7XG5cbiAgICAgICAgICBpZiAoYXZvaWRGYWxzZVplcm8gJiYgaXRlbS53aG9sZSA9PT0gMCAmJiBpdGVtLmRlY2ltYWwgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBwZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2ldXG4gICAgICAgID8gYy5pdGVtLmxlZ2VuZEZvbnRDb2xvclxuICAgICAgICA6IFwidHJhbnNwYXJlbnRcIjtcblxuICAgICAgaWYgKHR5cGVvZiBjPy5pdGVtPy5jb2xvciA9PT0gXCJzdHJpbmdcIiAmJiBjLml0ZW0uY29sb3IuaW5jbHVkZXMoJ2hzbCcpKSB7XG4gICAgICAgIGMuaXRlbS5jb2xvciA9IGhzbFRvUmdiYShjLml0ZW0uY29sb3IpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgICAgPFBhdGhcbiAgICAgICAgICAgIGQ9e2Muc2VjdG9yLnBhdGgucHJpbnQoKX1cbiAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIC8vIGZpbGw9e3RleHRDb2xvcn1cbiAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgICAgd2lkdGg9ezE2fVxuICAgICAgICAgICAgICBoZWlnaHQ9ezE2fVxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICAgIHJ4PXtOdW1iZXIoOCl9XG4gICAgICAgICAgICAgIHJ5PXtOdW1iZXIoOCl9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtgJHt2YWx1ZX0gJHtjLml0ZW0ubmFtZX1gfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0c+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5lcnJvcignQ0hBUlRTIFBpZUNoYXJ0IHRoaXMucHJvcHMgOicsIHRoaXMucHJvcHMpXG4gICAgY29uc29sZS5lcnJvcignQ0hBUlRTIFBpZUNoYXJ0IGNoYXJ0V2lkdGhQZXJjZW50YWdlIDonLCBjaGFydFdpZHRoUGVyY2VudGFnZSlcbiAgICBjb25zb2xlLmVycm9yKCdDSEFSVFMgUGllQ2hhcnQgdGhpcy5wcm9wcy5jaGFydENvbmZpZyA6JywgdGhpcy5wcm9wcy5jaGFydENvbmZpZylcbiAgICBjb25zb2xlLmVycm9yKCdDSEFSVFMgUGllQ2hhcnQgdGhpcy5wcm9wcyA6JywgdGhpcy5wcm9wcylcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6IDE2IH19XG4gICAgICAgID5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICAgIHJ4PXtOdW1iZXIoYm9yZGVyUmFkaXVzKX1cbiAgICAgICAgICAgIHJ5PXtOdW1iZXIoYm9yZGVyUmFkaXVzKX1cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgICAge2NhbGN1bGF0aW9uc31cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19