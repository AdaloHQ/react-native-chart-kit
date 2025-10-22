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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFtQixNQUFNLE9BQU8sQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFhLElBQUksSUFBSSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBQXFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQXdCcEMsSUFBTSxpQkFBaUIsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLHdDQUF3QztJQUN4QyxvRUFBb0U7SUFDcEUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3BDLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxDQUNMLElBQUksS0FBSyxJQUFJO1FBQ2IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTTtRQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMs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LEtBQUssQ0FBQyxDQUV4QjtZQUFBLENBQUMsTUFBTSxDQUNUO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxDQUNmO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBL1VELENBQXVCLGFBQWEsR0ErVW5DO0FBRUQsZUFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xuaW1wb3J0IFJlYWN0LCB7IEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUsIFRleHQgYXMgTmF0aXZlVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7IEcsIFBhdGgsIFJlY3QsIFN2ZywgVGV4dCB9IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IGhzbFRvUmdiYSB9IGZyb20gXCIuL1V0aWxzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IEFycmF5PGFueT47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhY2Nlc3Nvcjogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgYXZvaWRGYWxzZVplcm8/OiBib29sZWFuO1xuICBjaGFydFdpZHRoUGVyY2VudGFnZTogbnVtYmVyO1xuICBzaG93TGFiZWxQcmVmaXg6IGJvb2xlYW47XG4gIGVkaXRvcjogYm9vbGVhbjtcbn1cblxudHlwZSBQaWVDaGFydFN0YXRlID0ge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICBjYWxjdWxhdGluZzogQXJyYXk8YW55Pjtcbn07XG5cbmNvbnN0IGNvbXBhcmVEYXRhQXJyYXlzID0gKGEsIGIpID0+IHtcbiAgLy9UT0RPOiByZW1vdmUgdmFsdWVzIGZpZWxkIGZyb20gYSBhbmQgYlxuICAvL1RPRE86IGdldCB0aGUgc3VtIG9mIHZhbHVlcyB0byBtYWtlIHN1cmUgcGVyY2VudGFnZXMgc3RheSB0aGUgc2FtZVxuICBsZXQgc3VtQSA9IGEucmVkdWNlKChhY2N1bXVsYXRvciwgaXRlbSkgPT4ge1xuICAgIHJldHVybiBhY2N1bXVsYXRvciArIGl0ZW0udmFsdWU7XG4gIH0sIDApO1xuXG4gIGxldCBzdW1CID0gYi5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgaXRlbS52YWx1ZTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIChcbiAgICBzdW1BID09PSBzdW1CICYmXG4gICAgYS5sZW5ndGggPT09IGIubGVuZ3RoICYmXG4gICAgYS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBhQ29weSA9IHtcbiAgICAgICAgLi4udmFsdWUsXG4gICAgICAgIHZhbHVlczogbnVsbFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGJDb3B5ID0ge1xuICAgICAgICAuLi5iW2luZGV4XSxcbiAgICAgICAgdmFsdWVzOiBudWxsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFDb3B5KSA9PT0gSlNPTi5zdHJpbmdpZnkoYkNvcHkpO1xuICAgIH0pXG4gICk7XG59O1xuXG5jbGFzcyBQaWVDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8UGllQ2hhcnRQcm9wcywgUGllQ2hhcnRTdGF0ZT4ge1xuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy53aWR0aCAhPT0gcHJldlByb3BzLndpZHRoIHx8XG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAhPT0gcHJldlByb3BzLmhlaWdodCB8fFxuICAgICAgdGhpcy5wcm9wcy5jaGFydFdpZHRoUGVyY2VudGFnZSAhPT0gcHJldlByb3BzLmNoYXJ0V2lkdGhQZXJjZW50YWdlIHx8XG4gICAgICAhY29tcGFyZURhdGFBcnJheXModGhpcy5wcm9wcy5kYXRhLCBwcmV2UHJvcHMuZGF0YSlcbiAgICApIHtcbiAgICAgIGxldCBjYWxjdWxhdGluZyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcuZmlsdGVyKGkgPT4gaS5jYWxjdWxhdGluZyA9PT0gdHJ1ZSkubGVuZ3RoID09PVxuICAgICAgICAgIDAgJiZcbiAgICAgICAgdGhpcy5wcm9wcy53aWR0aCA9PT0gcHJldlByb3BzLndpZHRoICYmXG4gICAgICAgIGNvbXBhcmVEYXRhQXJyYXlzKHRoaXMucHJvcHMuZGF0YSwgcHJldlByb3BzLmRhdGEpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAuLi50aGlzLnN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY2FsY3VsYXRpbmcsXG4gICAgICAgICAgLi4udGhpcy5wcm9wc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBsZXQgY2FsY3VsYXRpbmcgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsY3VsYXRpbmdbaV0gPSB7IGxhYmVsOiB0aGlzLnByb3BzLmRhdGFbaV0sIGNhbGN1bGF0aW5nOiB0cnVlIH07XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYWxjdWxhdGluZyxcbiAgICAgIC4uLnByb3BzLFxuICAgICAgbGFiZWxEYXRhOiB0aGlzLnByb3BzLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gZmFsc2VcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHRoaXMuc3RhdGUuY2FsY3VsYXRpbmcubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgbGVnZW5kRm9udFNpemUsXG4gICAgICAgIGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gaXRlbS5sYWJlbDtcbiAgICAgIGlmIChpdGVtLmNhbGN1bGF0aW5nICYmIHRoaXMucHJvcHMuaGFzTGVnZW5kKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFic29sdXRlID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhbHVlID0gXCI1NSVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5zaG93TGFiZWxQcmVmaXggPT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPntgJHt2YWx1ZX0gJHtuYW1lfWB9PC9OYXRpdmVUZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGFsaWduU2VsZjogXCJmbGV4LXN0YXJ0XCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5hdGl2ZVRleHRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogbGVnZW5kRm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBsZWdlbmRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGxlZ2VuZEZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHsvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBgJHt2YWx1ZS53aG9sZX0lICR7bmFtZX1gfVxuICAgICAgICAgICAgICA8L05hdGl2ZVRleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcblxuICAgIGxldCBjaGFydFdpZHRoUGVyY2VudGFnZSA9IHRoaXMucHJvcHMuY2hhcnRXaWR0aFBlcmNlbnRhZ2UgKiAwLjAxO1xuXG4gICAgbGV0IHJhZGl1czogbnVtYmVyO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUgPFxuICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyXG4gICAgKSB7XG4gICAgICByYWRpdXMgPSB0aGlzLnByb3BzLmhlaWdodCAvIDIuNTtcbiAgICAgIGNoYXJ0V2lkdGhQZXJjZW50YWdlID0gMiAqIChyYWRpdXMgLyB0aGlzLnByb3BzLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gdGhpcy5wcm9wcy53aWR0aCAqIChjaGFydFdpZHRoUGVyY2VudGFnZSAvIDIpO1xuICAgIH1cblxuICAgIGlmIChjaGFydFdpZHRoUGVyY2VudGFnZSA9PT0gMSkge1xuICAgICAgY2hhcnRXaWR0aFBlcmNlbnRhZ2UgPSAwLjU7XG4gICAgfVxuXG4gICAgbGV0IGNoYXJ0ID0gUGllKHtcbiAgICAgIGNlbnRlcjogdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLFxuICAgICAgcjogMCxcbiAgICAgIFI6IHJhZGl1cyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSxcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcbiAgICAgICAgcmV0dXJuIHhbdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbCA9IHRoaXMuc3RhdGUuZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzT2JqZWN0KGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdLndob2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9XG4gICAgfSwgMCk7XG5cbiAgICBsZXQgdXBwZWRJbmRpY2VzID0gW107XG5cbiAgICBpZiAoIWFic29sdXRlKSB7XG4gICAgICBjb25zdCBkaXZpc29yID0gdG90YWwgLyAxMDAuMDtcbiAgICAgIGxldCB3aG9sZVRvdGFsID0gMDtcbiAgICAgIGNoYXJ0LmN1cnZlcy5mb3JFYWNoKChjLCBpKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QoYy5pdGVtLnZhbHVlcykpIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdIC8gZGl2aXNvcjtcbiAgICAgICAgICBjb25zdCBwaWVjZXMgPSBwZXJjZW50YWdlLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCB3aG9sZSA9IHBhcnNlSW50KHBpZWNlc1swXSk7XG4gICAgICAgICAgbGV0IGRlY2ltYWwgPSBwYXJzZUZsb2F0KFwiLlwiICsgcGllY2VzWzFdKTtcbiAgICAgICAgICBpZiAoaXNOYU4oZGVjaW1hbCkpIHtcbiAgICAgICAgICAgIGRlY2ltYWwgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aG9sZVRvdGFsICs9IHdob2xlO1xuICAgICAgICAgIC8vaGFkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QgaGVyZSB0byB1c2UgZm9yIHBlcmNlbnRhZ2VzLCBjaGFydCB3b3VsZG4ndCByZW5kZXIgd2hlbiBhc3NpZ25pbmcgdGhlIG9iamVjdCB0byBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICBjLml0ZW0udmFsdWVzID0ge1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB3aG9sZSxcbiAgICAgICAgICAgIGRlY2ltYWxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdob2xlVG90YWwgKz0gYy5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhhbWlsdG9uRGlmZiA9IDEwMCAtIHdob2xlVG90YWw7XG4gICAgICBjb25zdCBzb3J0ZWRDdXJ2ZXMgPSBbLi4uY2hhcnQuY3VydmVzXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLml0ZW0udmFsdWVzLmRlY2ltYWwgPCBiLml0ZW0udmFsdWVzLmRlY2ltYWwgPyAxIDogLTFcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbWlsdG9uRGlmZjsgaSsrKSB7XG4gICAgICAgIGxldCB1cHBlZFZhbCA9IHNvcnRlZEN1cnZlc1tpXS5pdGVtLnZhbHVlcy53aG9sZTtcbiAgICAgICAgc29ydGVkQ3VydmVzLnNvbWUoaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uaXRlbS52YWx1ZXMud2hvbGUgPT09IHVwcGVkVmFsKSB7XG4gICAgICAgICAgICB1cHBlZEluZGljZXMucHVzaChpdGVtLml0ZW0udmFsdWVzLmluZGV4KTtcbiAgICAgICAgICAgIGNoYXJ0LmN1cnZlc1tpdGVtLml0ZW0udmFsdWVzLmluZGV4XS5pdGVtLnZhbHVlcy53aG9sZSArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hhcnRDdXJ2ZXNTb3J0ZWQgPSBbLi4uY2hhcnQuY3VydmVzXS5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlICE9PSB0cnVlXG4gICAgKTtcbiAgICBsZXQgb3RoZXJTbGljZSA9IFsuLi5jaGFydC5jdXJ2ZXNdLmZpbmQoXG4gICAgICBpdGVtID0+IGl0ZW0uaXRlbS5vdGhlclNsaWNlID09PSB0cnVlXG4gICAgKTtcblxuICAgIGlmICghYWJzb2x1dGUpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkID0gY2hhcnRDdXJ2ZXNTb3J0ZWQuc29ydCgoYSwgYikgPT5cbiAgICAgICAgYS5pdGVtLnZhbHVlcy53aG9sZSA8IGIuaXRlbS52YWx1ZXMud2hvbGUgPyAxIDogLTFcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG90aGVyU2xpY2UpIHtcbiAgICAgIGNoYXJ0Q3VydmVzU29ydGVkLnB1c2gob3RoZXJTbGljZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2xpY2VzID0gY2hhcnRDdXJ2ZXNTb3J0ZWQubWFwKChjLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IHN0cmluZztcblxuICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnNob3dMYWJlbFByZWZpeCkge1xuICAgICAgICAgIHZhbHVlID0gYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgcGVyY2VudGFnZSB1c2luZyBIYW1pbHRvbidzIG1ldGhvZFxuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYy5pdGVtLnZhbHVlcztcbiAgICAgICAgICBsZXQgcGVyY2VudGFnZSA9IGl0ZW0ud2hvbGU7XG5cbiAgICAgICAgICBpZiAoYXZvaWRGYWxzZVplcm8gJiYgaXRlbS53aG9sZSA9PT0gMCAmJiBpdGVtLmRlY2ltYWwgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBwZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLmNhbGN1bGF0aW5nW2ldXG4gICAgICAgID8gYy5pdGVtLmxlZ2VuZEZvbnRDb2xvclxuICAgICAgICA6IFwidHJhbnNwYXJlbnRcIjtcblxuICAgICAgaWYgKHR5cGVvZiBjPy5pdGVtPy5jb2xvciA9PT0gXCJzdHJpbmdcIiAmJiBjLml0ZW0uY29sb3IuaW5jbHVkZXMoJ2hzbCcpKSB7XG4gICAgICAgIGMuaXRlbS5jb2xvciA9IGhzbFRvUmdiYShjLml0ZW0uY29sb3IpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgICAgPFBhdGhcbiAgICAgICAgICAgIGQ9e2Muc2VjdG9yLnBhdGgucHJpbnQoKX1cbiAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIC8vIGZpbGw9e3RleHRDb2xvcn1cbiAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgICAgd2lkdGg9ezE2fVxuICAgICAgICAgICAgICBoZWlnaHQ9ezE2fVxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0uY29sb3J9XG4gICAgICAgICAgICAgIHJ4PXtOdW1iZXIoOCl9XG4gICAgICAgICAgICAgIHJ5PXtOdW1iZXIoOCl9XG4gICAgICAgICAgICAgIHg9e1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSkgLVxuICAgICAgICAgICAgICAgIDI0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5zdGF0ZS5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uUHJlc3M9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBvbkNsaWNrPXtjLml0ZW0uYWN0aW9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxuICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgZmlsbD17dGV4dENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgZm9udFdlaWdodD17Yy5pdGVtLmxlZ2VuZEZvbnRXZWlnaHR9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoMTAwIC8gKGNoYXJ0V2lkdGhQZXJjZW50YWdlICogMTAwKSArIDAuNSl9XG4gICAgICAgICAgICAgIHk9e1xuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpICogaSArXG4gICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb25QcmVzcz17Yy5pdGVtLmFjdGlvbn1cbiAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2MuaXRlbS5hY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtgJHt2YWx1ZX0gJHtjLml0ZW0ubmFtZX1gfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0c+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIC4uLnN0eWxlXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmdSaWdodDogMTYgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cbiAgICAgICAgICAgIHJ4PXtOdW1iZXIoYm9yZGVyUmFkaXVzKX1cbiAgICAgICAgICAgIHJ5PXtOdW1iZXIoYm9yZGVyUmFkaXVzKX1cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgKHRoaXMucHJvcHMud2lkdGggKiBjaGFydFdpZHRoUGVyY2VudGFnZSkgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzbGljZXN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgICAge2NhbGN1bGF0aW9uc31cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0O1xuIl19