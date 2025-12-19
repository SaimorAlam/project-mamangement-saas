import { useAppSelector } from "@/hooks/useRedux";
import Papa from "papaparse";
import { useCallback, useEffect, useRef, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { useUploadSheetMutation } from "@/store/Api/SheetApi/SheetApi";

export default function ClientSingleProject() {
  const { file } = useAppSelector((state) => state.file);

  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [sheetId, setSheetId] = useState<string>(""); // store sheetId from filename
  const [isNewSheet, setIsNewSheet] = useState<boolean>(true); // track if first import
  const hotRef = useRef<any>(null); // handsontable instance is on hotRef.current.hotInstance
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadSheet] = useUploadSheetMutation();

  type CellPayload = {
    row: number;
    col: number;
    value: string | number | null;
    sheetId: string;
  };

  /* ------------------------ SUBMIT CELLS ------------------------ */
  const submitCells = useCallback(
    async (cells: CellPayload[]) => {
      if (!cells?.length) return;

      try {
        // uploadSheet is used for both new and update operations (server handles upsert)
        await Promise.all(cells.map((cell) => uploadSheet(cell).unwrap()));
        setIsNewSheet(false);
      } catch (err) {
        // Do not block UI on backend errors; log for debugging
        // Optionally: show toast or retry logic
        console.error("submitCells error", err);
      }
    },
    [isNewSheet, uploadSheet]
  );

  /* ------------------------ CSV PARSE ------------------------ */
  const parseCsvFile = useCallback(
    (csvFile: File) => {
      const nameWithoutExt = csvFile.name.replace(/\.[^/.]+$/, "");
      setSheetId(nameWithoutExt);
      setIsNewSheet(true); // mark as new sheet on import

      Papa.parse(csvFile, {
        skipEmptyLines: true,
        complete: (result) => {
          const raw = result.data as any[][];
          const data: string[][] = raw.map((row) =>
            row.map((v) => (v === null || v === undefined ? "" : String(v)))
          );
          setSheetData(data);

          // send all cells to backend
          const payload = data.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => ({
              row: rowIndex,
              col: colIndex,
              value,
              sheetId: nameWithoutExt,
            }))
          );

          submitCells(payload);
        },
      });
    },
    [submitCells]
  );

  /* ------------------------ INITIAL LOAD ------------------------ */
  useEffect(() => {
    if (file) parseCsvFile(file);
  }, [file, parseCsvFile]);

  /* ------------------------ CSV EXPORT ------------------------ */
  const handleExportCsv = useCallback(() => {
    if (!sheetData.length) return;

    const csv = Papa.unparse(sheetData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sheetId ? `${sheetId}.csv` : "sheet-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [sheetData, sheetId]);

  /* ------------------------ CSV IMPORT ------------------------ */
  const handleImportCsv = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = e.target.files?.[0];
      if (uploadedFile) parseCsvFile(uploadedFile);
    },
    [parseCsvFile]
  );

  /* ------------------------ ADD ROW ------------------------ */
  const addRow = useCallback(() => {
    const hot = hotRef.current?.hotInstance as any;

    // If sheet is empty, initialize first row and column
    if (sheetData.length === 0) {
      const initial = [[""]];
      setSheetData(initial);
      submitCells([
        { row: 0, col: 0, value: "", sheetId: sheetId || "default" },
      ]);
      setIsNewSheet(true);
      return;
    }

    const colCount = typeof hot?.countCols === "function" ? hot.countCols() : (sheetData[0]?.length ?? 1);
    const newRow = Array.from({ length: colCount }).map(() => "");

    setSheetData((prev) => {
      const updated = [...prev, newRow];
      const rowIndex = updated.length - 1;
      const payload = newRow.map((value, col) => ({
        row: rowIndex,
        col,
        value,
        sheetId: sheetId || "default",
      }));
      submitCells(payload);
      return updated;
    });
  }, [hotRef, sheetData, sheetId, submitCells]);

  /* ------------------------ ADD COLUMN ------------------------ */
  const addColumn = useCallback(() => {
    // If sheet is empty, initialize first row and column
    if (sheetData.length === 0) {
      const initial = [[""]];
      setSheetData(initial);
      submitCells([
        { row: 0, col: 0, value: "", sheetId: sheetId || "default" },
      ]);
      setIsNewSheet(true);
      return;
    }

    const updated = sheetData.map((r) => [...r, ""]);
    const newColIndex = updated[0].length - 1;
    const payload = updated.map((_, rowIndex) => ({
      row: rowIndex,
      col: newColIndex,
      value: "",
      sheetId: sheetId || "default",
    }));
    setSheetData(updated);
    submitCells(payload);
  }, [sheetData, sheetId, submitCells]);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Project Spreadsheet
        </h1>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCsv}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Import CSV
          </button>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Sheet */}
      <div className="relative w-full bg-white rounded-lg shadow border">
        {/* Add Row / Column buttons near sheet */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={addRow}
            className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Row
          </button>
          <button
            onClick={addColumn}
            className="px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            + Column
          </button>
        </div>

        {sheetData.length ? (
          <HotTable
            ref={hotRef}
            width="100%"
            height="70vh"
            stretchH="all"
            autoColumnSize={false}
            colWidths={() => 150}
            data={sheetData}
            contextMenu={true}
            manualRowMove={true}
            manualColumnMove={true}
            licenseKey="non-commercial-and-evaluation"
            afterChange={(changes: any, source?: any) => {
              if (source === "loadData" || !changes) return;

              const payload = (changes as any[]).map(([row, col, , newValue]) => ({
                row,
                col,
                value: (newValue as string | number | null),
                sheetId: sheetId || "default",
              }));

              submitCells(payload);
            }}

          />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No CSV loaded
          </div>
        )}
      </div>
    </div>
  );
}
