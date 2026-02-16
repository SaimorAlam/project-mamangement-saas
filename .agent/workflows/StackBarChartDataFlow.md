---
description: how the StackBarChart work from project builder to fetch default data and show on the project details dashboard tab
---

# StackedBarChart Data Flow Workflow
This workflow describes the process of creating, configuring, and displaying a `StackedBarChart` in the application.
## 1. Project Builder Configuration
When a user selects the **Stack Bar Chart** from the `ProjectWidget` in the `ClientProjectBuilder`:
- The `StackedBarChartModule` is rendered with randomized values initially to provide visual feedback before data is provided.
- **Note**: The **Add Tier** button is hidden in the chart menu before the chart is saved/created (while in `isCreationMode`).
- User configures the chart using `ProjectConfiguration` (Title, X-Axis labels, Legends, Colors, Ranges).
- If no data is returned from the API, the chart displays randomized values based on the current configuration to maintain a preview state.
## 2. Data Entry & Storage
- Data is typically uploaded via Excel/CSV or entered manually.
- The chart data is stored in the backend tied to the `projectId`.
- The `xAxis` field in the database stores the 2D array of values (e.g., `[["labels", "Legend1", "Legend2"], ["Point1", 10, 20], ...]`).
## 3. Data Fetching (Dashboard Tab)
When viewing the **Project Details > Dashboard Tab**:
- `useGetRootChartQuery(projectId)` is called to fetch all charts for the project.
- The system filters for charts where `category === "BAR"`.
## 4. Data Transformation
The raw `xAxis` data is transformed using `parseXAxisData` (found in `StackedBarChart.tsx` or `DefaultChartData.tsx`):
- **Labels**: Extracted from the first column of the `xAxis` array (excluding header).
- **Series Data**: Mapped from subsequent columns based on configured `legendValues`.
- **Sanitization**: Widget titles are sanitized to create valid sheet names for the chart logic.
## 5. Rendering
The transformed data is passed to the `StackedBarChart` component:
```tsx
<StackedBarChart
  widgetTitle={chart.title}
  xAxisValues={labels}
  legendValues={legendValues}
  allUploadedData={data} // Parsed data object
  isPreview={true}
/>
```
## Key Files
- `src/components/client/ProjectBuilder/chartModules/StackedBarChartModule.tsx`: Creation logic.
- `src/pages/client/ProjectDetails/AllDataTab/DashboardTab.tsx`: Display logic.
- `src/common/Charts/StackedBarChart.tsx`: Core chart component and parsing utility.