

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import ChartCardWrapper from "./components/ChartCardWrapper";
import { useChartTools } from "./hooks/useChartTools";

/* ---------- TYPES ---------- */

export type TreeDataNode = {
  id: string;
  name: string;
  value: number;
  color?: string; // Custom color for the node's progress bar
  highlight?: boolean; // For highlighting "best" path
  children?: TreeDataNode[];
};

type Props = {
  widgetTitle?: string;
  data?: TreeDataNode; // Start with a root node
  onToggleWidget?: () => void;
  chartId?: string;
  onDelete?: () => void;
  onDataChange?: (data: TreeDataNode) => void;
};

/* ---------- DUMMY DATA GENERATOR ---------- */
// Helper to generate sample tree if no data provided
const generateSampleTree = (): TreeDataNode => ({
  id: "root",
  name: "Total Sales",
  value: 1000000,
  children: [
    {
      id: "region-na",
      name: "North America",
      value: 600000,
      children: [
        { id: "usa", name: "USA", value: 450000 },
        { id: "canada", name: "Canada", value: 150000 },
      ],
    },
    {
      id: "region-eu",
      name: "Europe",
      value: 300000,
      children: [
        { id: "uk", name: "UK", value: 120000 },
        { id: "germany", name: "Germany", value: 100000 },
        { id: "france", name: "France", value: 80000 },
      ],
    },
    {
      id: "region-asia",
      name: "Asia",
      value: 100000,
    },
  ],
});

/* ---------- NODE COMPONENTS ---------- */

const TreeNode = ({
  node,
  depth = 0,
  maxValue,
}: {
  node: TreeDataNode;
  depth: number;
  maxValue: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // Percentage bar width relative to sibling maximum (or parent? usually sibling max for context)
  // For simplicity, let's just use relative to maxValue passed down.
  const percentage = Math.min((node.value / maxValue) * 100, 100);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2 relative group">
        
        {/* Connector Line (Vertical) */}
        {depth > 0 && (
           <div 
             className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300" 
             style={{ transform: "translateY(-50%)" }}
           />
        )}

        {/* Node Card */}
        <div 
            className={`
                relative flex items-center justify-between min-w-[200px] p-3 
                bg-white border rounded shadow-sm hover:shadow-md transition-shadow
                ${node.highlight ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200"}
            `}
        >
            <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{node.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(node.value)}
                    </span>
                    <span className="text-xs text-gray-400">
                        ({((node.value / maxValue) * 100).toFixed(1)}%)
                    </span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: node.color || (node.highlight ? "#3b82f6" : "#9ca3af")
                        }}
                    />
                </div>
            </div>

            {/* Expand/Collapse Header Icon - Only if children exist */}
            {hasChildren && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            )}
        </div>

        {/* Expand Trigger (Right side connector) */}
        {hasChildren && isExpanded && (
            <div className="w-8 h-px bg-gray-300" />
        )}
      </div>

      {/* Children Container */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col ml-8 pl-4 border-l border-gray-300 space-y-2 relative"
            >
                {node.children!.map((child) => (
                    <TreeNode key={child.id} node={child} depth={depth + 1} maxValue={node.value} /> // pass parent value as max for relative %
                ))}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/* ---------- MAIN COMPONENT ---------- */

export default function DecompositionTreeChart({
  widgetTitle = "Decomposition Tree",
  data,
  onToggleWidget,
  chartId = "root",
  onDelete,
  // onDataChange,
}: Props) {
  /* ---------- HOOKS ---------- */
  const { isDownloading, handleCopy } = useChartTools();

  /* ---------- ZOOM & PAN STATE ---------- */
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- DATA ---------- */
  const treeData = useMemo(() => data || generateSampleTree(), [data]);


  /* ---------- ZOOM & PAN HANDLERS ---------- */
  // Use useEffect to attach wheel listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.min(Math.max(prev * delta, 0.5), 3));
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev * 0.8, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  /* ---------- ACTIONS ---------- */
  const onCopy = () => {
    handleCopy(treeData);
  };
  
  // Flatten tree for CSV download is complex, dumping JSON for now or flat list
  const onDownload = () => {
    // Basic CSV flatten: allow user to see structure
    // Since common CSV structure is X/Legend, this might not fit ideally.
    // We'll dump a simplified list for now.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = [];
    const traverse = (node: TreeDataNode, path: string) => {
        rows.push({
            Path: path,
            Name: node.name,
            Value: node.value
        });
        if(node.children) {
            node.children.forEach(child => traverse(child, `${path} > ${node.name}`));
        }
    };
    traverse(treeData, "");
    
    // We can use generic text copy/download or build custom csv string
    const header = ["Path", "Name", "Value"].join(",");
    const csvContent = [header, ...rows.map(r => `${r.Path},${r.Name},${r.Value}`)].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${widgetTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ChartCardWrapper
      title={widgetTitle}
      subtitle="Data Breakdown"
      chartId={chartId}
      tierLevel={0}
      menuActions={{
        onCopy,
        onDownload,
        onDelete,
        onToggleWidget,
      }}
      isDownloading={isDownloading}
    >
      <div className="relative w-full h-[500px] bg-gray-50 border border-gray-100 rounded">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-md p-2">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Zoomable/Pannable Container */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="p-6 min-w-max transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            <TreeNode node={treeData} depth={0} maxValue={treeData.value} />
          </div>
        </div>
      </div>
    </ChartCardWrapper>
  );
}
