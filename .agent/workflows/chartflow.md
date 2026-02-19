---
description: Unified Chart Workflow for Project Builder and Project Details dashboard integration
---

# Unified Chart Data Flow Workflow

This workflow describes the end-to-end process of creating, configuring, and managing hierarchical charts (Tiers) in the application.

## 1. Project Builder: Chart Selection & Configuration
When a user adds a chart in the `ClientProjectBuilder`:
- **Module Interface**: Selecting a category (e.g., `BAR`, `LINE`, `PIE`) renders a specific module (e.g., `LineChartModule.tsx`).
- **Configuration Component**: Modules use `WidgetForChartModuleOne` (for multi-series charts like Bar/Line) or `WidgetForChartModuleTwo` (for simpler charts) to configure:
    - **Title**: Chart identifier.
    - **X-Axis Fields**: Labels for data points.
    - **Legends**: Number of datasets, their labels, and colors.
    - **Ranges**: Starting and ending numeric ranges for axes.
- **Initial Payload**: `handleSaveChanges` constructs the payload:
    - `xAxis`: Stringified 2D array: `[["Label", "Legend1", ...], ["Field1", 0, 0], ...]`.
    - `widgets`: Array of `{ legendName, color }`.
    - `category`: Matches `chartTypes` key (e.g., `BAR`, `PIE`).
- **Template Download**: `DownloadAndSaveCSVforModuleOneWidget` generates a CSV template for the user to fill.

## 2. Dashboard Integration (Project Details)
In the **Dashboard Tab**, `DefaultChartData.tsx` handles rendering:
- **Category Parsing**: Uses `chartTypes` mapping from `src/utils/ChartCategory.ts` to access the correct API response property.
    - Example: If `item.category === "BAR"`, it looks at `item.barChart`.
- **Data Transformation**:
    - `parseXAxisData` (or similar utility) converts the 2D `xAxis` array into:
        - `labels`: `string[]` for the X-axis.
        - `data`: A structured object keyed by series name for the chart component.
- **Rendering**: Passes transformed data and configuration props to the specific component (e.g., `StackedBarChart`, `PieChartWidget`).

## 3. Tier Management (Child Charts)
Hierarchical levels are managed within the chart components:
- **Add Tier**: In the chart menu, `handleAddTierClick` triggers:
    1. **Payload Preparation**: Creates a `childPayload` inheriting properties from the parent BUT with `parentId` set and `title` empty.
    2. **X-Axis Initialization**: The child's `xAxis` is initialized with the parent's current labels but reset numeric values (zeros).
    3. **Hierarchy Tracking**: `grouptitle` is maintained to link the family of charts.
    4. **Storage**: Dispatches payload to Redux `chartSlice (setChildPayload)`.
    5. **Modal**: Opens `AddTierModal` to collect the new tier name and call `createChart`.

## 4. Download & Save CSV/Excel
- **Download Utility**: Components include a `handleDownload` function using `XLSX`.
- **Content**: The export includes headers and current labels, providing a data entry template for that specific Chart and its Children.
- **Save Flow**: When "Creating" or "Updating", the system typically saves the configuration (metadata) and the structure, while values are updated via file uploads that populate the `xAxis` numeric columns.

## Implementation Guide for New Chart Types
To implement this flow for a new chart (e.g., `HISTOGRAM`):
1. **Category Mapping**: Add the category to `src/utils/ChartCategory.ts`.
2. **Dashboard Logic**: Add a conditional block in `DefaultChartData.tsx` to handle the `category` and render the new component.
3. **Add Tier Support**:
    - Implement `handleAddTierClick` in the chart component.
    - Ensure it dispatches the category-specific payload to Redux.
4. **Data Parsing**: Ensure `parseXAxisData` (or a custom parser) correctly handles the data structure required by the new chart library/component.
5. **Download Support**: Implement `handleDownload` (often using `XLSX`) to provide the user with a matching CSV/Excel template.

## Key Files
- `src/utils/ChartCategory.ts`: Source of truth for category-to-property mapping.
- `src/pages/client/ProjectBuilder/Components/DefaultChartData.tsx`: Central hub for rendering charts on the dashboard.
- `src/common/Modal/AddTierModal.tsx`: Shared modal for creating child charts.
- `src/components/client/ProjectBuilder/WidgetForChartModuleOne.tsx`: Shared configuration UI.
- `src/common/Charts/StackedBarChart.tsx`: Reference implementation for Tiers and Downloads.
