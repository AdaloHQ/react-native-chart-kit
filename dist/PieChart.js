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
        _this.state = __assign(__assign({ calculating: calculating }, props), { labelData: _this.props.data });
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
                this.setState(__assign(__assign({ calculating: calculating }, this.props), this.state));
            }
            else {
                this.setState(__assign({ calculating: calculating }, this.props));
            }
        }
    };
    PieChart.prototype.render = function () {
        var _this = this;
        console.error('CHARTS PieChart render');
        var _a = this.props, _b = _a.style, style = _b === void 0 ? {} : _b, backgroundColor = _a.backgroundColor, _c = _a.absolute, absolute = _c === void 0 ? false : _c, _d = _a.hasLegend, hasLegend = _d === void 0 ? true : _d, _e = _a.avoidFalseZero, avoidFalseZero = _e === void 0 ? false : _e;
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
                    return (<View key={index} style={{ alignSelf: "flex-start", position: "absolute" }}>
              <NativeText style={{
                            fontFamily: legendFontFamily,
                            fontSize: legendFontSize,
                            fontWeight: legendFontWeight,
                            color: "transparent"
                        }}>{"".concat(value, " ").concat(name)}</NativeText>
            </View>);
                }
                else {
                    return (<View key={index} style={{ alignSelf: "flex-start", position: "absolute" }}>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFhLElBQUksSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBQXFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQXdCcEMsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMs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QyxDQUFDLENBQ0EsQ0FBQyxDQUFDLENBQ0EsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FBQyxDQUNELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUN6QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUV4QjtZQUFBLENBQUMsTUFBTSxDQUNUO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxDQUNmO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBdFZELENBQXVCLGFBQWEsR0FzVm5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xuaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUsIFRleHQgYXMgTmF0aXZlVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZywgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IGhzbFRvUmdiYSB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhY2Nlc3Nvcjogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgYXZvaWRGYWxzZVplcm8/OiBib29sZWFuO1xuICBjaGFydFdpZHRoUGVyY2VudGFnZTogbnVtYmVyO1xuICBzaG93TGFiZWxQcmVmaXg6IGJvb2xlYW47XG4gIGVkaXRvcjogYm9vbGVhbjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICBjYWxjdWxhdGluZzogQXJyYXk8YW55Pjtcbn07XG5cbmNvbnN0IGNvbXBhcmVEYXRhQXJyYXlzID0gKGEsIGIpID0+IHtcbiAgLy9UT0RPOiByZW1vdmUgdmFsdWVzIGZpZWxkIGZyb20gYSBhbmQgYlxuICAvL1RPRE86IGdldCB0aGUgc3VtIG9mIHZhbHVlcyB0byBtYWtlIHN1cmUgcGVyY2VudGFnZXMgc3RheSB0aGUgc2FtZVxuICBsZXQgc3VtQSA9IGEucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIGxldCBzdW1CID0gYi5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIChcbiAgICBzdW1BID09PSBzdW1CICYmXG4gICAgYS5sZW5ndGggPT09IGIubGVuZ3RoICYmXG4gICAgYS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBhQ29weSA9IHtcbiAgICAgICAgLi4udmFsdWUsXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGJDb3B5ID0ge1xuICAgICAgICAuLi5iW2luZGV4XSxcbiAgICAgICAgdmFsdWVzOiBudWxsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFDb3B5KSA9PT0gSlNPTi5zdHJpbmdpZnkoYkNvcHkpO1xuICAgIH0pXG4gICk7XG59O1xuXG5jbGFzcyBQaWVDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8UGllQ2hhcnRQcm9wcywgUGllQ2hhcnRTdGF0ZT4ge1xuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy53aWR0aCAhPT0gcHJldlByb3BzLndpZHRoIHx8XG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gcHJldlByb3BzLmhlaWdodCB8fFxuICAgICAgdGhpcy5wcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSAhPT0gcHJldlByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlIHx8XG4gICAgICAhY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICApIHtcbiAgICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcuZmlsdGVyKGkgPT4gaS5jYWxjdWxhdGluZyA9PT0gdHJ1ZSkubGVuZ3RoID09PVxuICAgICAgICAgIDAgJiZcbiAgICAgICAgdGhpcy5wcm9wcy53aWR0aCA9PT0gcHJldlByb3BzLndpZHRoICYmXG4gICAgICAgIGNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgLi4udGhpcy5wcm9wc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYWxjdWxhdGluZyxcbiAgICAgIC4uLnByb3BzLFxuICAgICAgbGFiZWxEYXRhOiB0aGlzLnByb3BzLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NIQVJUUyBQaWVDaGFydCByZW5kZXInKVxuXG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIGFic29sdXRlID0gZmFsc2UsXG4gICAgICBoYXNMZWdlbmQgPSB0cnVlLFxuICAgICAgYXZvaWRGYWxzZVplcm8gPSBmYWxzZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgY2FsY3VsYXRpb25zID0gdGhpcy5zdGF0ZS5jYWxjdWxhdGluZy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQge1xuICAgICAgICBuYW1lLFxuICAgICAgICBsZWdlbmRGb250RmFtaWx5LFxuICAgICAgICBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgbGVnZW5kRm9udFdlaWdodCxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0gPSBpdGVtLmxhYmVsO1xuICAgICAgaWYgKGl0ZW0uY2FsY3VsYXRpbmcgJiYgdGhpcy5wcm9wcy5oYXNMZWdlbmQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYWJzb2x1dGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIjU1JVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgYWxpZ25TZWxmOiBcImZsZXgtc3RhcnRcIiwgcG9zaXRpb246IFwiYWJzb2x1dGVcIiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8TmF0aXZlVGV4dFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBsZWdlbmRGb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGxlZ2VuZEZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogbGVnZW5kRm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+e2Ake3ZhbHVlfSAke25hbWV9YH08L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgYWxpZ25TZWxmOiBcImZsZXgtc3RhcnRcIiwgcG9zaXRpb246IFwiYWJzb2x1dGVcIiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8TmF0aXZlVGV4dFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBsZWdlbmRGb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGxlZ2VuZEZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogbGVnZW5kRm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgey8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGAke3ZhbHVlLndob2xlfSUgJHtuYW1lfWB9XG4gICAgICAgICAgICAgIDwvTmF0aXZlVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAgfSA9IHN0eWxlO1xuXG4gICAgbGV0IGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gdGhpcy5wcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSAqIDAuMDE7XG5cbiAgICBsZXQgcmFkaXVzOiBudW1iZXI7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAvIDIuNSA8XG4gICAgICAodGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlKSAvIDJcbiAgICApIHtcbiAgICAgIHJhZGl1cyA9IHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41O1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAyICogKHJhZGl1cyAvIHRoaXMucHJvcHMud2lkdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLndpZHRoICogKGNoYXJ0V2lkdGhQZXJjZW50YWdlIC8gMik7XG4gICAgfVxuXG4gICAgaWYgKGNoYXJ0V2lkdGhQZXJjZW50YWdlID09PSAxKSB7XG4gICAgICBjaGFydFdpZHRoUGVyY2VudGFnZSA9IDAuNTtcbiAgICB9XG5cbiAgICBsZXQgY2hhcnQgPSBQaWUoe1xuICAgICAgY2VudGVyOiB0aGlzLnByb3BzLmNlbnRlciB8fCBbMCwgMF0sXG4gICAgICByOiAwLFxuICAgICAgUjogcmFkaXVzLFxuICAgICAgZGF0YTogdGhpcy5zdGF0ZS5kYXRhLFxuICAgICAgYWNjZXNzb3I6IHggPT4ge1xuICAgICAgICByZXR1cm4geFt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5zdGF0ZS5kYXRhLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XG4gICAgICBpZiAoaXNPYmplY3QoaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSkpIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0ud2hvbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgIH1cbiAgICB9LCAwKTtcblxuICAgIGxldCB1cHBlZEluZGljZXMgPSBbXTtcblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNvbnN0IGRpdmlzb3IgPSB0b3RhbCAvIDEwMC4wO1xuICAgICAgbGV0IHdob2xlVG90YWwgPSAwO1xuICAgICAgY2hhcnQuY3VydmVzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgICAgaWYgKCFpc09iamVjdChjLml0ZW0udmFsdWVzKSkge1xuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0gLyBkaXZpc29yO1xuICAgICAgICAgIGNvbnN0IHBpZWNlcyA9IHBlcmNlbnRhZ2UudG9TdHJpbmcoKS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgbGV0IHdob2xlID0gcGFyc2VJbnQocGllY2VzWzBdKTtcbiAgICAgICAgICBsZXQgZGVjaW1hbCA9IHBhcnNlRmxvYXQoXCIuXCIgKyBwaWVjZXNbMV0pO1xuICAgICAgICAgIGlmIChpc05hTihkZWNpbWFsKSkge1xuICAgICAgICAgICAgZGVjaW1hbCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHdob2xlVG90YWwgKz0gd2hvbGU7XG4gICAgICAgICAgLy9oYWQgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBoZXJlIHRvIHVzZSBmb3IgcGVyY2VudGFnZXMsIGNoYXJ0IHdvdWxkbid0IHJlbmRlciB3aGVuIGFzc2lnbmluZyB0aGUgb2JqZWN0IHRvIGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXVxuICAgICAgICAgIGMuaXRlbS52YWx1ZXMgPSB7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIHdob2xlLFxuICAgICAgICAgICAgZGVjaW1hbFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2hvbGVUb3RhbCArPSBjLml0ZW0udmFsdWVzLndob2xlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaGFtaWx0b25EaWZmID0gMTAwIC0gd2hvbGVUb3RhbDtcbiAgICAgIGNvbnN0IHNvcnRlZEN1cnZlcyA9IFsuLi5jaGFydC5jdXJ2ZXNdLnNvcnQoKGEsIGIpID0+XG4gICAgICAgIGEuaXRlbS52YWx1ZXMuZGVjaW1hbCA8IGIuaXRlbS52YWx1ZXMuZGVjaW1hbCA/IDEgOiAtMVxuICAgICAgKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFtaWx0b25EaWZmOyBpKyspIHtcbiAgICAgICAgbGV0IHVwcGVkVmFsID0gc29ydGVkQ3VydmVzW2ldLml0ZW0udmFsdWVzLndob2xlO1xuICAgICAgICBzb3J0ZWRDdXJ2ZXMuc29tZShpdGVtID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5pdGVtLnZhbHVlcy53aG9sZSA9PT0gdXBwZWRWYWwpIHtcbiAgICAgICAgICAgIHVwcGVkSW5kaWNlcy5wdXNoKGl0ZW0uaXRlbS52YWx1ZXMuaW5kZXgpO1xuICAgICAgICAgICAgY2hhcnQuY3VydmVzW2l0ZW0uaXRlbS52YWx1ZXMuaW5kZXhdLml0ZW0udmFsdWVzLndob2xlICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjaGFydEN1cnZlc1NvcnRlZCA9IFsuLi5jaGFydC5jdXJ2ZXNdLmZpbHRlcihcbiAgICAgIGl0ZW0gPT4gaXRlbS5pdGVtLm90aGVyU2xpY2UgIT09IHRydWVcbiAgICApO1xuICAgIGxldCBvdGhlclNsaWNlID0gWy4uLmNoYXJ0LmN1cnZlc10uZmluZChcbiAgICAgIGl0ZW0gPT4gaXRlbS5pdGVtLm90aGVyU2xpY2UgPT09IHRydWVcbiAgICApO1xuXG4gICAgaWYgKCFhYnNvbHV0ZSkge1xuICAgICAgY2hhcnRDdXJ2ZXNTb3J0ZWQgPSBjaGFydEN1cnZlc1NvcnRlZC5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLndob2xlIDwgYi5pdGVtLnZhbHVlcy53aG9sZSA/IDEgOiAtMVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAob3RoZXJTbGljZSkge1xuICAgICAgY2hhcnRDdXJ2ZXNTb3J0ZWQucHVzaChvdGhlclNsaWNlKTtcbiAgICB9XG5cbiAgICBjb25zdCBzbGljZXMgPSBjaGFydEN1cnZlc1NvcnRlZC5tYXAoKGMsIGkpID0+IHtcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xuXG4gICAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuc2hvd0xhYmVsUHJlZml4KSB7XG4gICAgICAgICAgdmFsdWUgPSBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2NhbGN1bGF0ZSBwZXJjZW50YWdlIHVzaW5nIEhhbWlsdG9uJ3MgbWV0aG9kXG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHZhbHVlID0gMCArIFwiJVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjLml0ZW0udmFsdWVzO1xuICAgICAgICAgIGxldCBwZXJjZW50YWdlID0gaXRlbS53aG9sZTtcblxuICAgICAgICAgIGlmIChhdm9pZEZhbHNlWmVybyAmJiBpdGVtLndob2xlID09PSAwICYmIGl0ZW0uZGVjaW1hbCAhPT0gMCkge1xuICAgICAgICAgICAgdmFsdWUgPSBcIjwxJVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBlcmNlbnRhZ2UgKyBcIiVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHRleHRDb2xvciA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmdbaV1cbiAgICAgICAgPyBjLml0ZW0ubGVnZW5kRm9udENvbG9yXG4gICAgICAgIDogXCJ0cmFuc3BhcmVudFwiO1xuXG4gICAgICBpZiAodHlwZW9mIGM/Lml0ZW0/LmNvbG9yID09PSBcInN0cmluZ1wiICYmIGMuaXRlbS5jb2xvci5pbmNsdWRlcygnaHNsJykpIHtcbiAgICAgICAgYy5pdGVtLmNvbG9yID0gaHNsVG9SZ2JhKGMuaXRlbS5jb2xvcilcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgZD17Yy5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgLy8gZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD17MTZ9XG4gICAgICAgICAgICAgIGhlaWdodD17MTZ9XG4gICAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgICAgcng9e051bWJlcig4KX1cbiAgICAgICAgICAgICAgcnk9e051bWJlcig4KX1cbiAgICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KSAtXG4gICAgICAgICAgICAgICAgMjRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSAqIGkgK1xuICAgICAgICAgICAgICAgIDEyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXt0ZXh0Q29sb3J9XG4gICAgICAgICAgICAgIGZvbnRTaXplPXtjLml0ZW0ubGVnZW5kRm9udFNpemV9XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk9e2MuaXRlbS5sZWdlbmRGb250RmFtaWx5fVxuICAgICAgICAgICAgICBmb250V2VpZ2h0PXtjLml0ZW0ubGVnZW5kRm9udFdlaWdodH1cbiAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvICgxMDAgLyAoY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAxMDApICsgMC41KX1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMiAqIDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvblByZXNzPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgb25DbGljaz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Ake3ZhbHVlfSAke2MuaXRlbS5uYW1lfWB9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvRz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmVycm9yKCdDSEFSVFMgUGllQ2hhcnQgdGhpcy5wcm9wcyA6JywgdGhpcy5wcm9wcylcbiAgICBjb25zb2xlLmVycm9yKCdDSEFSVFMgUGllQ2hhcnQgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgOicsIGNoYXJ0V2lkdGhQZXJjZW50YWdlKVxuICAgIGNvbnNvbGUuZXJyb3IoJ0NIQVJUUyBQaWVDaGFydCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnIDonLCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnKVxuICAgIGNvbnNvbGUuZXJyb3IoJ0NIQVJUUyBQaWVDaGFydCB0aGlzLnByb3BzIDonLCB0aGlzLnByb3BzKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIC4uLnN0eWxlXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmdSaWdodDogMTYgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgcng9e051bWJlcihib3JkZXJSYWRpdXMpfVxuICAgICAgICAgICAgcnk9e051bWJlcihib3JkZXJSYWRpdXMpfVxuICAgICAgICAgICAgZmlsbD17YmFja2dyb3VuZENvbG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEdcbiAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAodGhpcy5wcm9wcy53aWR0aCAqIGNoYXJ0V2lkdGhQZXJjZW50YWdlKSAvIDIgK1xuICAgICAgICAgICAgICBOdW1iZXIodGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA/IHRoaXMucHJvcHMucGFkZGluZ0xlZnQgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeT17dGhpcy5wcm9wcy5oZWlnaHQgLyAyfVxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3NsaWNlc31cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgICB7Y2FsY3VsYXRpb25zfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGllQ2hhcnQ7XG4iXX0=