export const handleDownloadCSV = (csvTemplate : string, widgetTitle: string) => {
    const blob = new Blob([csvTemplate], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${widgetTitle}-template.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };