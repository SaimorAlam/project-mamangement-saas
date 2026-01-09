import { useAppSelector } from "@/hooks/useRedux";
import Papa from "papaparse";
import { useCallback, useEffect, useRef, useState } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/dist/handsontable.full.css";
import {
  useUploadSheetMutation /*useUpdateSheetMutation*/,
} from "@/store/Api/SheetApi/SheetApi";

export default function ClientSingleProject() {
  const { file } = useAppSelector((state) => state.file);

  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [sheetId, setSheetId] = useState<string>(""); // store sheetId from filename
  // Use an `any` ref to avoid type mismatch with the HotTable instance (hotInstance)
  const hotRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadSheet] = useUploadSheetMutation();
  // const [updateSheet] = useUpdateSheetMutation(); // new mutation for updating existing cells

  /* ------------------------ SUBMIT CELLS ------------------------ */
  const submitCells = async (cells: any[]) => {
    if (!cells.length) return;

    await Promise.all(
      cells.map(async (cell) => {
        await uploadSheet(cell).unwrap();
      })
    );
  };

  /* ------------------------ CSV PARSE ------------------------ */
  const parseCsvFile = useCallback(
    (csvFile: File) => {
      const nameWithoutExt = csvFile.name.replace(/\.[^/.]+$/, "");
      const match = nameWithoutExt.match(
        /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      );

      const uuid = match ? match[0] : null;

      // Only set the sheetId if we found a UUID; otherwise set to empty string
      setSheetId(uuid ?? "");

      Papa.parse(csvFile, {
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data as any[][];
          setSheetData(data);

          // send all cells to backend
          const payload: any[] = [];
          data.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
              payload.push({
                row: rowIndex,
                col: colIndex,
                value,
                sheetId: uuid,
              });
            });
          });

          submitCells(payload);
        },
      });
    },
    [submitCells]
  );

  /* ------------------------ INITIAL LOAD ------------------------ */
  useEffect(() => {
    if (file) parseCsvFile(file);
  }, [file]);

  /* ------------------------ CSV EXPORT ------------------------ */
  const handleExportCsv = () => {
    if (!sheetData.length) return;

    const csv = Papa.unparse(sheetData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sheetId ? `${sheetId}.csv` : "sheet-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ------------------------ CSV IMPORT ------------------------ */
  const handleImportCsv = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) parseCsvFile(uploadedFile);
  };

  /* ------------------------ ADD ROW ------------------------ */
  const addRow = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    // If sheet is empty, initialize first row and column
    if (sheetData.length === 0) {
      setSheetData([[""]]);
      submitCells([
        { row: 0, col: 0, value: "", sheetId: sheetId || "default" },
      ]);
      return;
    }

    const newRow = Array(hot.countCols()).fill("");
    setSheetData((prev) => {
      const updated = [...prev, newRow];
      const payload = newRow.map((value, col) => ({
        row: updated.length - 1,
        col,
        value,
        sheetId: sheetId || "default",
      }));
      submitCells(payload);
      return updated;
    });
  };

  /* ------------------------ ADD COLUMN ------------------------ */
  const addColumn = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    // If sheet is empty, initialize first row and column
    if (sheetData.length === 0) {
      setSheetData([[""]]);
      submitCells([
        { row: 0, col: 0, value: "", sheetId: sheetId || "default" },
      ]);
      return;
    }

    setSheetData((prev) => {
      const updated = prev.map((row) => [...row, ""]);
      const newColIndex = updated[0].length - 1;
      const payload = updated.map((rowIndex) => ({
        row: rowIndex,
        col: newColIndex,
        value: "",
        sheetId: sheetId || "default",
      }));
      submitCells(payload);
      return updated;
    });
  };

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
      <div className="relative w-full bg-white rounded-lg shadow">
        {/* Add Row / Column buttons near sheet */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={addRow}
            className="px-2 py-1 text-xs rounded bg-gray-400 text-white"
          >
            + Row
          </button>
          <button
            onClick={addColumn}
            className="px-2 py-1 text-xs rounded bg-gray-400 text-white"
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
            // Give `changes` a relaxed type to avoid TS errors from Handsontable signatures
            afterChange={(changes: any[] | null, source?: string) => {
              if (source === "loadData" || !changes) return;

              const payload = changes.map(
                ([row, col, _oldValue, newValue]: any) => ({
                  row,
                  col,
                  value: newValue,
                  sheetId: sheetId || "default",
                })
              );

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
