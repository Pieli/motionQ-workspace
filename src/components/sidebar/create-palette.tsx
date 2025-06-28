import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, Shuffle, Plus } from "lucide-react";

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function isColorLight(hex: string) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

const PALETTE_SIZE = 5;
const MIN_COLORS = 2;
const MAX_COLORS = 5;

type CreatePaletteProps = {
    onCreate: (colors: string[]) => void;
};

export const CreatePalette: React.FC<CreatePaletteProps> = ({ onCreate }) => {
    const [colors, setColors] = useState<string[]>(() =>
        Array.from({ length: PALETTE_SIZE }, randomColor)
    );
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // For smooth drag-and-drop reordering
    const handleDragStart = (idx: number) => {
        setDraggedIdx(idx);
        dragOverItem.current = idx;
    };

    const handleDragEnter = (idx: number) => {
        dragOverItem.current = idx;
        if (draggedIdx === null || draggedIdx === idx) return;
        setColors((prev) => {
            const arr = [...prev];
            const [removed] = arr.splice(draggedIdx, 1);
            arr.splice(idx, 0, removed);
            return arr;
        });
        setDraggedIdx(idx);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
        dragOverItem.current = null;
    };

    const handleColorChange = (idx: number, value: string) => {
        setColors((prev) => prev.map((c, i) => (i === idx ? value : c)));
    };

    const handleRemove = (idx: number) => {
        if (colors.length > MIN_COLORS) setColors(colors.filter((_, i) => i !== idx));
    };

    const handleAdd = () => {
        if (colors.length < MAX_COLORS) setColors([...colors, randomColor()]);
    };

    const handleRandomize = () => {
        setColors(Array.from({ length: PALETTE_SIZE }, randomColor));
    };

    return (
        <div>
            <div className="flex gap-2 w-full">
                {colors.map((color, idx) => {
                    const isLight = isColorLight(color);
                    const fg = isLight ? "black" : "white";
                    const hoverBg = isLight ? "hover:bg-black/80" : "hover:bg-white/80";
                    const border = draggedIdx === idx ? "ring-2 ring-primary scale-105 z-10" : "border";
                    return (
                        <div
                            key={idx}
                            className={`relative flex-1 flex flex-col items-center transition-all duration-150 ${border}`}
                            style={{
                                minWidth: 0,
                                background: color,
                                height: 96,
                                borderRadius: 8,
                                position: "relative",
                                color: fg,
                                visibility: draggedIdx === idx ? "hidden" : undefined
                            }}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div
                                className="w-full h-full flex flex-col justify-end items-center"
                                style={{ minHeight: 64, height: "100%" }}
                                onClick={() => {
                                    const input = document.getElementById(`color-input-${idx}`);

                                }}
                            >
                                <span
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono px-1 rounded"
                                    style={{
                                        background: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
                                        color: fg,
                                    }}
                                >
                                    {color.toUpperCase()}
                                </span>
                            </div>
                            <input
                                id={`color-input-${idx}`}
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(idx, e.target.value)}
                                className="hidden"
                            />
                            <div className="absolute top-1 right-1 flex flex-col items-end gap-1">
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className={`p-0.5 rounded ${hoverBg}`}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        outline: "none",
                                        cursor: "grab",
                                    }}
                                    aria-label="Drag color"
                                // Drag handled by parent div
                                >
                                    <GripVertical className="w-4 h-4" style={{ color: fg }} />
                                </button>
                                {colors.length > MIN_COLORS && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(idx);
                                        }}
                                        className={`p-0.5 rounded ${hoverBg}`}
                                        aria-label="Remove color"
                                    >
                                        <Trash2 className="w-4 h-4" style={{
                                            color: fg,
                                            cursor: "pointer"
                                        }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {colors.length < MAX_COLORS && (
                    <div className="flex flex-col justify-center items-center flex-1 min-w-0">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-full h-20"
                            onClick={handleAdd}
                            aria-label="Add color"
                        >
                            <Plus className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>
                <div className="flex justify-between pt-4">
                    <div className="flex gap-2 mb-2 items-center">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRandomize}
                        className="flex items-center gap-1"
                    >
                        <Shuffle className="w-4 h-4" />
                        Random Palette
                    </Button>
                </div>
                <Button
                    variant={"outline"}
                    onClick={() => onCreate(colors)}
                    className="mt-4 w-fit"
                    disabled={colors.length < MIN_COLORS}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};