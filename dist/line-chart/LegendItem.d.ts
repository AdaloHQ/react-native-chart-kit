import React from "react";
import { TextProps } from "react-native-svg";
type Color = string;
export type LegendItemProps = {
    baseLegendItemX: number;
    index: number;
    legendOffset: number;
    legendText: string;
    iconColor: Color;
    labelProps: TextProps;
};
export declare const LegendItem: (props: LegendItemProps) => React.JSX.Element;
export {};
//# sourceMappingURL=LegendItem.d.ts.map