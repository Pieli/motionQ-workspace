import React, { useState, useEffect, useRef } from "react";

export default function SvgPreviewer() {
  const svgUrl = "/dashboard.svg";
  const [treeData, setTreeData] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const svgContainerRef = useRef(null);

  // Fetch and parse SVG, then build treeData
  useEffect(() => {
    fetch(svgUrl)
      .then((res) => res.text())
      .then((svgText) => {
        svgContainerRef.current.innerHTML = svgText;
        const svgEl = svgContainerRef.current.querySelector("svg");

        // Build tree from <g> elements
        const buildTree = (element) =>
          Array.from(element.children)
            .filter((child) => child.tagName.toLowerCase() === "g")
            .map((group) => ({
              id: group.id || Math.random().toString(36).substr(2, 9),
              name: group.id || "group",
              children: buildTree(group),
            }));

        const topGroups = buildTree(svgEl);
        setTreeData(topGroups);

        // Expand first level by default
        setExpandedIds(new Set(topGroups.map((node) => node.id)));
      });
  }, [svgUrl]);

  // Highlight logic with rectangle overlay
  useEffect(() => {
    const container = svgContainerRef.current;
    console.log("hello");
    if (!container) return;
    const svgEl = container?.querySelector("svg");
    console.log("hi");
    if (!svgEl) return;

    // Remove any existing overlay
    const old = svgEl.querySelector("#highlight-overlay");
    if (old) old.remove();
    console.log("ho");

    if (hoveredId) {
      const target = svgEl.querySelector(`#${CSS.escape(hoveredId)}`);
      if (target) {
        const bbox = target.getBBox();
        console.log("ha");

        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        rect.setAttribute("x", `${bbox.x - 5}`);
        rect.setAttribute("y", `${bbox.y >= 5 ? bbox.y - 5 : 0}`);
        rect.setAttribute("width", `${bbox.width + 10}`);
        rect.setAttribute("height", `${bbox.height + 10}`);
        rect.setAttribute("id", "highlight-overlay");
        rect.setAttribute("fill", "none");
        rect.setAttribute("stroke", "blue");
        rect.setAttribute("stroke-width", "2");
        console.log(rect);
        svgEl.appendChild(rect);
      }
    }
  }, [hoveredId]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderTree = (nodes, level = 0) => (
    <ul className={`pl-${level * 4}`}>
      {nodes.map((node) => (
        <li key={node.id} className="mb-1">
          <div
            className="flex items-center cursor-pointer"
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {node.children.length > 0 && (
              <button
                className="mr-2 focus:outline-none"
                onClick={() => toggleExpand(node.id)}
              >
                {expandedIds.has(node.id) ? "▼" : "▶"}
              </button>
            )}
            <span>{node.name}</span>
          </div>
          {node.children.length > 0 &&
            expandedIds.has(node.id) &&
            renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex h-full">
      <aside className="w-1/4 border-r overflow-auto p-4">
        {renderTree(treeData)}
      </aside>
      <main className="flex-1 p-4 overflow-auto" ref={svgContainerRef} />
    </div>
  );
}
