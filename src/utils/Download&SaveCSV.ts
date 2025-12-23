/* eslint-disable @typescript-eslint/no-explicit-any */
    const buildCsvTemplate = (xAxisValues: any, legendValues: any) => {
    const header = ["X-Axis", ...legendValues.map((l:any) => l.label)].join(",");

    const rows = xAxisValues.map(
      (label:any) => `${label}${",".repeat(legendValues.length)}`
    );

    return [header, ...rows].join("\n");
  };
  const downloadCsvFile = (csv: string, fileName: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };
export const DownloadAndSaveCSVforModuleOneWidget = async (
    payload: any, 
    getChartTitleId: any, 
    widgetTitle:string,
    legendValues: any,
    xAxisValues: any
)=>{
    try{
    const result = await getChartTitleId(payload).unwrap();

    const uniqueId = result.data.id; // backend generated id

    const csvTemplate = buildCsvTemplate(legendValues, xAxisValues);
    downloadCsvFile(csvTemplate, `${widgetTitle}_${uniqueId}.csv`);
    } catch (error) {
    console.error("Download failed", error);
    alert("Failed to download CSV");
  }
}