/* eslint-disable @typescript-eslint/no-explicit-any */
import { LegendValue } from "./chartTypes";

type HeaderProps = {
  effectiveLegendValues: LegendValue[];
  children?: React.ReactNode;
};

export const ChartLegendHeader = ({
  effectiveLegendValues,
  children,
}: HeaderProps) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-wrap gap-x-2 gap-y-2 justify-end">
        {effectiveLegendValues.map((l) =>
          l.label ? (
            <div key={l.field} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: l.color }}
              />
              <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                {l.label}
              </span>
            </div>
          ) : null,
        )}
      </div>
      {children}
    </div>
  );
};

export const ChartChildTierFooter = ({
  childTiers,
}: {
  childTiers?: any[];
}) => {
  if (!childTiers || childTiers.length === 0) return undefined;

  return (
    <p className="text-sm text-blue-600 font-medium">
      Click chart to view {childTiers.length} child tier
      {childTiers.length > 1 ? "s" : ""}
    </p>
  );
};
