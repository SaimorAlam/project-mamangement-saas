import { useState } from "react";
import { X, Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { TreeDataNode } from "@/common/Charts/DecompositionTreeChart";

type Props = {
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  treeData: TreeDataNode;
  onTreeDataChange: (data: TreeDataNode) => void;
  onClose: () => void;
};

const TreeConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  treeData,
  onTreeDataChange,
  onClose,
}: Props) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root"]),
  );

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const updateNode = (
    node: TreeDataNode,
    targetId: string,
    updater: (node: TreeDataNode) => TreeDataNode,
  ): TreeDataNode => {
    if (node.id === targetId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          updateNode(child, targetId, updater),
        ),
      };
    }
    return node;
  };

  const deleteNode = (
    node: TreeDataNode,
    targetId: string,
  ): TreeDataNode | null => {
    if (node.id === targetId) {
      return null;
    }
    if (node.children) {
      const filteredChildren = node.children
        .map((child) => deleteNode(child, targetId))
        .filter((child): child is TreeDataNode => child !== null);
      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    }
    return node;
  };

  const handleAddChild = (parentId: string) => {
    const newChild: TreeDataNode = {
      id: `node-${Date.now()}`,
      name: "New Node",
      value: 0,
    };

    const updated = updateNode(treeData, parentId, (node) => ({
      ...node,
      children: [...(node.children || []), newChild],
    }));

    onTreeDataChange(updated);
    setExpandedNodes((prev) => new Set([...prev, parentId]));
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === treeData.id) {
      alert("Cannot delete root node");
      return;
    }
    const updated = deleteNode(treeData, nodeId);
    if (updated) {
      onTreeDataChange(updated);
    }
  };

  const handleUpdateNodeName = (nodeId: string, name: string) => {
    const updated = updateNode(treeData, nodeId, (node) => ({ ...node, name }));
    onTreeDataChange(updated);
  };

  const handleUpdateNodeValue = (nodeId: string, value: number) => {
    const updated = updateNode(treeData, nodeId, (node) => ({
      ...node,
      value,
    }));
    onTreeDataChange(updated);
  };

  const handleUpdateNodeColor = (nodeId: string, color: string) => {
    const updated = updateNode(treeData, nodeId, (node) => ({
      ...node,
      color,
    }));
    onTreeDataChange(updated);
  };

  const renderTreeNode = (node: TreeDataNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isRoot = node.id === treeData.id;

    return (
      <div key={node.id} className="mb-2  w-full">
        <div
          className="flex flex-row-reverse items-center gap-2 p-2 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors scrollbar-hide "
          // style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Node Info */}
          <div className="flex-1 flex flex-col gap-1 w-fit overflow-hidden ">
            <input
              type="text"
              value={node.name}
              onChange={(e) => handleUpdateNodeName(node.id, e.target.value)}
              className="px-2 py-1 w-full text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
              placeholder="Node name"
            />
            <div className="w-full">
              <input
                type="number"
                value={node.value}
                onChange={(e) =>
                  handleUpdateNodeValue(node.id, Number(e.target.value))
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                placeholder="Value"
              />
            </div>
            <div className="flex items-center justify-between gap-5">
            <input
                type="color"
                value={node.color || "#3b82f6"}
                onChange={(e) => handleUpdateNodeColor(node.id, e.target.value)}
                className="w-full h-8 border border-gray-200 rounded cursor-pointer"
                title="Node color"
              />
          {/* Action Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => handleAddChild(node.id)}
              className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Add Child"
            >
              <Plus size={16} />
            </button>
            {!isRoot && (
              <button
                onClick={() => handleDeleteNode(node.id)}
                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete Node"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
            </div>
          </div>

        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-w-[350px] w-1/3 h-fit max-h-[calc(100vh-100px)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 shrink-0">
        <h3 className="text-lg font-semibold text-gray-800">
          Configuration
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
        {/* Widget Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Widget Title
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter widget title"
          />
        </div>

        {/* Tree Structure */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tree Structure
          </label>
          <div className="text-xs text-gray-500 mb-3">
            Click + to add children, edit values inline, or delete nodes
          </div>
          {renderTreeNode(treeData)}
        </div>
      </div>

       <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50 shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TreeConfiguration;
