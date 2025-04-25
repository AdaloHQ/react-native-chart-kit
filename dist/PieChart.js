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
            if (typeof ((_a = c === null || c === void 0 ? void 0 : c.item) === null || _a === void 0 ? void 0 : _a.color) === "string" && c.item.color.includes('hsl')) {
                c.item.color = hslToRgba(c.item.color);
            }
            console.log("c.item: ", c.item);
            console.log("this.state: ", _this.state);
            console.log("backgroundColor: ", backgroundColor);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFhLElBQUksSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBQXFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQTBCcEMsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMs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SSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FBQyxDQUNELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUN6QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUV4QjtZQUFBLENBQUMsTUFBTSxDQUNUO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxDQUNmO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBdFlELENBQXVCLGFBQWEsR0FzWW5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xuaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUsIFRleHQgYXMgTmF0aXZlVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZywgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IGhzbFRvUmdiYSB9IGZyb20gXCIuL1V0aWxzXCI7XG4vLyBpbXBvcnQgVGV4dFdpZHRoRmluZGVyIGZyb20gXCIuL1RleHRXaWR0aEZpbmRlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgY2hhcnRXaWR0aFBlcmNlbnRhZ2U6IG51bWJlcjtcbiAgc2hvd0xhYmVsUHJlZml4OiBib29sZWFuO1xuICBlZGl0b3I6IGJvb2xlYW47XG59XG5cbnR5cGUgUGllQ2hhcnRTdGF0ZSA9IHtcbiAgZGF0YTogQXJyYXk8YW55PjtcbiAgb25MYXlvdXQ6IGJvb2xlYW47XG4gIGNhbGN1bGF0aW5nOiBBcnJheTxhbnk+O1xufTtcblxuY29uc3QgY29tcGFyZURhdGFBcnJheXMgPSAoYSwgYikgPT4ge1xuICAvL1RPRE86IHJlbW92ZSB2YWx1ZXMgZmllbGQgZnJvbSBhIGFuZCBiXG4gIC8vVE9ETzogZ2V0IHRoZSBzdW0gb2YgdmFsdWVzIHRvIG1ha2Ugc3VyZSBwZXJjZW50YWdlcyBzdGF5IHRoZSBzYW1lXG4gIGxldCBzdW1BID0gYS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZTtcbiAgfSwgMCk7XG5cbiAgbGV0IHN1bUIgPSBiLnJlZHVjZSgoYWNjdW11bGF0b3IsIGl0ZW0pID0+IHtcbiAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBpdGVtLnZhbHVlO1xuICB9LCAwKTtcblxuICByZXR1cm4gKFxuICAgIHN1bUEgPT09IHN1bUIgJiZcbiAgICBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiZcbiAgICBhLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGFDb3B5ID0ge1xuICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgdmFsdWVzOiBudWxsXG4gICAgICB9O1xuICAgICAgY29uc3QgYkNvcHkgPSB7XG4gICAgICAgIC4uLmJbaW5kZXhdLFxuICAgICAgICB2YWx1ZXM6IG51bGxcbiAgICAgIH07XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYUNvcHkpID09PSBKU09OLnN0cmluZ2lmeShiQ29weSk7XG4gICAgfSlcbiAgKTtcbn07XG5cbmNsYXNzIFBpZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxQaWVDaGFydFByb3BzLCBQaWVDaGFydFN0YXRlPiB7XG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLndpZHRoICE9PSBwcmV2UHJvcHMud2lkdGggfHxcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0ICE9PSBwcmV2UHJvcHMuaGVpZ2h0IHx8XG4gICAgICB0aGlzLnByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlICE9PSBwcmV2UHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgfHxcbiAgICAgICFjb21wYXJlRGF0YUFycmF5cyh0aGlzLnByb3BzLmRhdGEsIHByZXZQcm9wcy5kYXRhKVxuICAgICkge1xuICAgICAgbGV0IGNhbGN1bGF0aW5nID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYWxjdWxhdGluZ1tpXSA9IHsgbGFiZWw6IHRoaXMucHJvcHMuZGF0YVtpXSwgY2FsY3VsYXRpbmc6IHRydWUgfTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5maWx0ZXIoaSA9PiBpLmNhbGN1bGF0aW5nID09PSB0cnVlKS5sZW5ndGggPT09XG4gICAgICAgICAgMCAmJlxuICAgICAgICB0aGlzLnByb3BzLndpZHRoID09PSBwcmV2UHJvcHMud2lkdGggJiZcbiAgICAgICAgLy8gIXRoaXMucHJvcHMuZWRpdG9yICYmXG4gICAgICAgIGNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgb25MYXlvdXQ6IGZhbHNlLFxuICAgICAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICAgICAgLi4udGhpcy5zdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgICAgIG9uTGF5b3V0OiB0cnVlLFxuICAgICAgICAgIC4uLnRoaXMucHJvcHNcbiAgICAgICAgICAvLyAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYWxjdWxhdGluZ1tpXSA9IHsgbGFiZWw6IHRoaXMucHJvcHMuZGF0YVtpXSwgY2FsY3VsYXRpbmc6IHRydWUgfTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNhbGN1bGF0aW5nLFxuICAgICAgb25MYXlvdXQ6IHRydWUsXG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGxhYmVsRGF0YTogdGhpcy5wcm9wcy5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgYWJzb2x1dGUgPSBmYWxzZSxcbiAgICAgIGhhc0xlZ2VuZCA9IHRydWUsXG4gICAgICBhdm9pZEZhbHNlWmVybyA9IGZhbHNlXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvL1RPRE86IG1vdmUgc2V0U3RhdGUgb3V0IG9mIG9ubGF5b3V0IHNpbmNlIGl0IHJ1bnMgaW4gYSBmb3IgbG9vcFxuICAgIGNvbnN0IG9uTGF5b3V0ID0gKGUsIGluZGV4LCBmb250U2l6ZSwgbGFiZWwpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLm9uTGF5b3V0KSB7XG4gICAgICAgIGxldCB3aWR0aCA9IGUubmF0aXZlRXZlbnQubGF5b3V0LndpZHRoO1xuICAgICAgICBsZXQgdGFyZ2V0ID1cbiAgICAgICAgICB0aGlzLnByb3BzLndpZHRoIC0gdGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlIC0gODQ7XG4gICAgICAgIGxldCBjYWxjdWxhdGluZyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmc7XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgdGFyZ2V0KSB7XG4gICAgICAgICAgY2FsY3VsYXRpbmdbaW5kZXhdLmNhbGN1bGF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobGFiZWwuc2xpY2UoLTMpID09PSBcIi4uLlwiKSB7XG4gICAgICAgICAgICBsYWJlbCA9IGxhYmVsLnNsaWNlKDAsIC0zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzTmFOKGZvbnRTaXplKSkge1xuICAgICAgICAgICAgaWYgKCFmb250U2l6ZSkge1xuICAgICAgICAgICAgICBmb250U2l6ZSA9IFwiMTJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IC0gZm9udFNpemUuc3BsaXQoXCJwXCIpWzBdICogMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IC0gZm9udFNpemUgKiAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBudW1iZXJPZkNoYXJhY3RlcnMgPSBsYWJlbC5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgcmF0aW8gPSB0YXJnZXQgLyB3aWR0aDtcbiAgICAgICAgICBjb25zdCB0YXJnZXRDaGFyYWN0ZXJzID0gTWF0aC5mbG9vcihyYXRpbyAqIG51bWJlck9mQ2hhcmFjdGVycyk7XG4gICAgICAgICAgbGFiZWwgPSBgJHtsYWJlbC5zbGljZSgwLCB0YXJnZXRDaGFyYWN0ZXJzKX0uLi5gO1xuICAgICAgICAgIGNhbGN1bGF0aW5nW2luZGV4XS5sYWJlbC5uYW1lID0gbGFiZWw7XG4gICAgICAgICAgaWYgKGxhYmVsID09PSBcIi4uLlwiKSB7XG4gICAgICAgICAgICBjYWxjdWxhdGluZ1tpbmRleF0uY2FsY3VsYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjYWxjdWxhdGluZyxcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjYWxjdWxhdGlvbnMgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgIGxlZ2VuZEZvbnRTaXplLFxuICAgICAgICBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICB2YWx1ZVxuICAgICAgfSA9IGl0ZW0ubGFiZWw7XG4gICAgICBpZiAoaXRlbS5jYWxjdWxhdGluZyAmJiB0aGlzLnByb3BzLmhhc0xlZ2VuZCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hYnNvbHV0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiNTUlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc2hvd0xhYmVsUHJlZml4ID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID57YCR7dmFsdWV9ICR7bmFtZX1gfTwvTmF0aXZlVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6IFwiZmxleC1zdGFydFwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiIH19XG4gICAgICAgICAgICAgIG9uTGF5b3V0PXtlID0+IG9uTGF5b3V0KGUsIGluZGV4LCBsZWdlbmRGb250U2l6ZSwgbmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxOYXRpdmVUZXh0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGxlZ2VuZEZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogbGVnZW5kRm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBsZWdlbmRGb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Ly9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgYCR7dmFsdWUud2hvbGV9JSAke25hbWV9YH1cbiAgICAgICAgICAgICAgPC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCB9ID0gc3R5bGU7XG5cbiAgICBsZXQgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSB0aGlzLnByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlICogMC4wMTtcblxuICAgIGxldCByYWRpdXM6IG51bWJlcjtcblxuICAgIGlmIChcbiAgICAgIHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41IDxcbiAgICAgICh0aGlzLnByb3BzLndpZHRoICogY2hhcnRXaWR0aFBlcmNlbnRhZ2UpIC8gMlxuICAgICkge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjU7XG4gICAgICBjaGFydFdpZHRoUGVyY2VudGFnZSA9IDIgKiAocmFkaXVzIC8gdGhpcy5wcm9wcy53aWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGl1cyA9IHRoaXMucHJvcHMud2lkdGggKiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgLyAyKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPT09IDEpIHtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMC41O1xuICAgIH1cblxuICAgIGxldCBjaGFydCA9IFBpZSh7XG4gICAgICBjZW50ZXI6IHRoaXMucHJvcHMuY2VudGVyIHx8IFswLCAwXSxcbiAgICAgIHI6IDAsXG4gICAgICBSOiByYWRpdXMsXG4gICAgICBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsXG4gICAgICBhY2Nlc3NvcjogeCA9PiB7XG4gICAgICAgIHJldHVybiB4W3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnN0YXRlLmRhdGEucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcbiAgICAgIGlmIChpc09iamVjdChpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdKSkge1xuICAgICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXS53aG9sZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgfVxuICAgIH0sIDApO1xuXG4gICAgbGV0IHVwcGVkSW5kaWNlcyA9IFtdO1xuXG4gICAgaWYgKCFhYnNvbHV0ZSkge1xuICAgICAgY29uc3QgZGl2aXNvciA9IHRvdGFsIC8gMTAwLjA7XG4gICAgICBsZXQgd2hvbGVUb3RhbCA9IDA7XG4gICAgICBjaGFydC5jdXJ2ZXMuZm9yRWFjaCgoYywgaSkgPT4ge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGMuaXRlbS52YWx1ZXMpKSB7XG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSAvIGRpdmlzb3I7XG4gICAgICAgICAgY29uc3QgcGllY2VzID0gcGVyY2VudGFnZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICBsZXQgd2hvbGUgPSBwYXJzZUludChwaWVjZXNbMF0pO1xuICAgICAgICAgIGxldCBkZWNpbWFsID0gcGFyc2VGbG9hdChcIi5cIiArIHBpZWNlc1sxXSk7XG4gICAgICAgICAgaWYgKGlzTmFOKGRlY2ltYWwpKSB7XG4gICAgICAgICAgICBkZWNpbWFsID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgd2hvbGVUb3RhbCArPSB3aG9sZTtcbiAgICAgICAgICAvL2hhZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGhlcmUgdG8gdXNlIGZvciBwZXJjZW50YWdlcywgY2hhcnQgd291bGRuJ3QgcmVuZGVyIHdoZW4gYXNzaWduaW5nIHRoZSBvYmplY3QgdG8gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdXG4gICAgICAgICAgYy5pdGVtLnZhbHVlcyA9IHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgd2hvbGUsXG4gICAgICAgICAgICBkZWNpbWFsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aG9sZVRvdGFsICs9IGMuaXRlbS52YWx1ZXMud2hvbGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoYW1pbHRvbkRpZmYgPSAxMDAgLSB3aG9sZVRvdGFsO1xuICAgICAgY29uc3Qgc29ydGVkQ3VydmVzID0gWy4uLmNoYXJ0LmN1cnZlc10uc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy5kZWNpbWFsIDwgYi5pdGVtLnZhbHVlcy5kZWNpbWFsID8gMSA6IC0xXG4gICAgICApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYW1pbHRvbkRpZmY7IGkrKykge1xuICAgICAgICBsZXQgdXBwZWRWYWwgPSBzb3J0ZWRDdXJ2ZXNbaV0uaXRlbS52YWx1ZXMud2hvbGU7XG4gICAgICAgIHNvcnRlZEN1cnZlcy5zb21lKGl0ZW0gPT4ge1xuICAgICAgICAgIGlmIChpdGVtLml0ZW0udmFsdWVzLndob2xlID09PSB1cHBlZFZhbCkge1xuICAgICAgICAgICAgdXBwZWRJbmRpY2VzLnB1c2goaXRlbS5pdGVtLnZhbHVlcy5pbmRleCk7XG4gICAgICAgICAgICBjaGFydC5jdXJ2ZXNbaXRlbS5pdGVtLnZhbHVlcy5pbmRleF0uaXRlbS52YWx1ZXMud2hvbGUgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0Q3VydmVzU29ydGVkID0gWy4uLmNoYXJ0LmN1cnZlc10uZmlsdGVyKFxuICAgICAgaXRlbSA9PiBpdGVtLml0ZW0ub3RoZXJTbGljZSAhPT0gdHJ1ZVxuICAgICk7XG4gICAgbGV0IG90aGVyU2xpY2UgPSBbLi4uY2hhcnQuY3VydmVzXS5maW5kKFxuICAgICAgaXRlbSA9PiBpdGVtLml0ZW0ub3RoZXJTbGljZSA9PT0gdHJ1ZVxuICAgICk7XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjaGFydEN1cnZlc1NvcnRlZCA9IGNoYXJ0Q3VydmVzU29ydGVkLnNvcnQoKGEsIGIpID0+XG4gICAgICAgIGEuaXRlbS52YWx1ZXMud2hvbGUgPCBiLml0ZW0udmFsdWVzLndob2xlID8gMSA6IC0xXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChvdGhlclNsaWNlKSB7XG4gICAgICBjaGFydEN1cnZlc1NvcnRlZC5wdXNoKG90aGVyU2xpY2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHNsaWNlcyA9IGNoYXJ0Q3VydmVzU29ydGVkLm1hcCgoYywgaSkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG5cbiAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXgpIHtcbiAgICAgICAgICB2YWx1ZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY2FsY3VsYXRlIHBlcmNlbnRhZ2UgdXNpbmcgSGFtaWx0b24ncyBtZXRob2RcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwICsgXCIlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGMuaXRlbS52YWx1ZXM7XG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBpdGVtLndob2xlO1xuICAgICAgICAgIC8vIGlmICh1cHBlZEluZGljZXMuaW5jbHVkZXMoaXRlbS5pbmRleCkpIHtcbiAgICAgICAgICAvLyAgIHBlcmNlbnRhZ2UgKz0gMTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgICAgaWYgKGF2b2lkRmFsc2VaZXJvICYmIGl0ZW0ud2hvbGUgPT09IDAgJiYgaXRlbS5kZWNpbWFsICE9PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiPDElXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dENvbG9yID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZ1tpXVxuICAgICAgICA/IGMuaXRlbS5sZWdlbmRGb250Q29sb3JcbiAgICAgICAgOiBcInRyYW5zcGFyZW50XCI7XG5cbiAgICAgIGlmICh0eXBlb2YgYz8uaXRlbT8uY29sb3IgPT09IFwic3RyaW5nXCIgJiYgYy5pdGVtLmNvbG9yLmluY2x1ZGVzKCdoc2wnKSkge1xuICAgICAgICBjLml0ZW0uY29sb3IgPSBoc2xUb1JnYmEoYy5pdGVtLmNvbG9yKVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcImMuaXRlbTogXCIsIGMuaXRlbSlcbiAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5zdGF0ZTogXCIsIHRoaXMuc3RhdGUpXG4gICAgICBjb25zb2xlLmxvZyhcImJhY2tncm91bmRDb2xvcjogXCIsIGJhY2tncm91bmRDb2xvcilcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgZD17Yy5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgLy8gZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD17MTZ9XG4gICAgICAgICAgICAgIGhlaWdodD17MTZ9XG4gICAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgICAgcng9e051bWJlcig4KX1cbiAgICAgICAgICAgICAgcnk9e051bWJlcig4KX1cbiAgICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KSAtXG4gICAgICAgICAgICAgICAgMjRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgICAgICAgIDEyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXt0ZXh0Q29sb3J9XG4gICAgICAgICAgICAgIGZvbnRTaXplPXtjLml0ZW0ubGVnZW5kRm9udFNpemV9XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk9e2MuaXRlbS5sZWdlbmRGb250RmFtaWx5fVxuICAgICAgICAgICAgICBmb250V2VpZ2h0PXtjLml0ZW0ubGVnZW5kRm9udFdlaWdodH1cbiAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KX1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMiAqIDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Ake3ZhbHVlfSAke2MuaXRlbS5uYW1lfWB9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvRz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgc3R5bGU9e3sgcGFkZGluZ1JpZ2h0OiAxNiB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgcng9e051bWJlcihib3JkZXJSYWRpdXMpfVxuICAgICAgICAgICAgcnk9e051bWJlcihib3JkZXJSYWRpdXMpfVxuICAgICAgICAgICAgZmlsbD17YmFja2dyb3VuZENvbG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEdcbiAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAodGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlKSAvIDIgK1xuICAgICAgICAgICAgICBOdW1iZXIodGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA/IHRoaXMucHJvcHMucGFkZGluZ0xlZnQgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeT17dGhpcy5wcm9wcy5oZWlnaHQgLyAyfVxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3NsaWNlc31cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgICB7Y2FsY3VsYXRpb25zfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGllQ2hhcnQ7XG4iXX0=