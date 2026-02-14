/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Trash2, Download, Upload } from "lucide-react";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";

type MenuActions = {
  onCopy?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onAddTier?: () => void;
  onToggleWidget?: () => void;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type Props = {
  title: string;
  subtitle?: string;
  chartId?: string; // Used for unique IDs like upload input
  children: React.ReactNode;
  footer?: React.ReactNode;
  menuActions: MenuActions;
  isDownloading?: boolean;
  tierLevel?: number;
  onHeaderClick?: () => void;
  customHeaderContent?: React.ReactNode; // For extra icons/text in header
  className?: string;
  isPreview?: boolean;
};

const ChartCardWrapper = ({
  title,
  subtitle,
  chartId = "root",
  children,
  footer,
  menuActions,
  isDownloading = false,
  tierLevel = 0,
  onHeaderClick,
  customHeaderContent,
  className = "",
  isPreview = false,
}: Props) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
    }
    setShowPopover(false);
  };

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${
        onHeaderClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      } ${className}`}
      onClick={() => {
        if (onHeaderClick) {
          onHeaderClick();
        }
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div
          className="flex items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {customHeaderContent}

          {/* MENU 3-DOTS */}
          {!isPreview && (
            <div className="relative border-l pl-4">
              <button
                className="p-2 border rounded hover:bg-gray-50"
                onClick={() => setShowPopover(!showPopover)}
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div
                  ref={popoverRef}
                  className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-999"
                >
                  {/* COPY */}
                  {/* {menuActions.onCopy && (
                    <button
                      onClick={() => handleAction(menuActions.onCopy)}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left items-center"
                    >
                      <Copy size={18} /> Copy
                    </button>
                  )} */}

                  {/* DOWNLOAD - Only for Root */}
                  {tierLevel === 0 && menuActions.onDownload && (
                    <button
                      onClick={() => handleAction(menuActions.onDownload)}
                      disabled={isDownloading}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left items-center"
                    >
                      <Download size={18} />{" "}
                      {isDownloading ? "Downloading..." : "Download"}
                    </button>
                  )}

                  {/* UPLOAD - Only for Root */}
                  {tierLevel === 0 && menuActions.onUpload && (
                    <>
                      <button
                        onClick={() => {
                          document
                            .getElementById(`upload-input-${chartId}`)
                            ?.click();
                          setShowPopover(false);
                        }}
                        className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left items-center"
                      >
                        <Upload size={18} /> Upload Data
                      </button>
                      <input
                        id={`upload-input-${chartId}`}
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={menuActions.onUpload}
                      />
                    </>
                  )}

                  {/* DELETE */}
                  {menuActions.onDelete && (
                    <button
                      onClick={() => handleAction(menuActions.onDelete)}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-red-600 text-left items-center"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  )}

                  {/* WIDGET TOGGLE */}
                  {menuActions.onToggleWidget && (
                    <button
                      onClick={() => handleAction(menuActions.onToggleWidget)}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left items-center"
                    >
                      <MdOutlineWidgets size={18} /> Widget
                    </button>
                  )}

                  {/* ADD TIER */}
                  {menuActions.onAddTier && (
                    <button
                      onClick={() => handleAction(menuActions.onAddTier)}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left items-center"
                    >
                      <GoPlus size={18} /> Add Tier
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full">{children}</div>

      {/* FOOTER */}
      {footer && <div className="mt-4 text-center">{footer}</div>}
    </div>
  );
};

export default ChartCardWrapper;
