"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

interface GameCanvasProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  isActive?: boolean;
  onDrawStart?: () => void;
}

export default function GameCanvas({
  width = 400,
  height = 400,
  onSave,
  isActive = true,
  onDrawStart,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set up the canvas
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#000";
    context.lineWidth = 5;

    // Fill with white background
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    setCtx(context);
  }, []);

  // Clear canvas when isActive changes to true (new game starts)
  useEffect(() => {
    if (isActive && canvasRef.current && ctx) {
      clearCanvas();
    }
  }, [isActive]);

  // Drawing functions
  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isActive) return;

    setIsDrawing(true);

    if (!ctx) return;

    ctx.beginPath();

    // Get coordinates
    const coordinates = getCoordinates(e);
    if (!coordinates) return;

    ctx.moveTo(coordinates.x, coordinates.y);

    // Notify parent that drawing has started
    if (onDrawStart) {
      onDrawStart();
    }
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !ctx || !isActive) return;

    // Get coordinates
    const coordinates = getCoordinates(e);
    if (!coordinates) return;

    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();

    // Save the drawing after each stroke
    if (onSave) {
      onSave(canvasRef.current?.toDataURL("image/png") || "");
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (!ctx) return;
    ctx.closePath();
  };

  const getCoordinates = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      // Touch event
      if (e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    return null;
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Also save the cleared canvas
    if (onSave) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm w-full mx-auto"
        style={{ aspectRatio: "16/9" }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`touch-none w-full h-full ${!isActive ? "cursor-not-allowed" : "cursor-crosshair"}`}
        />
        {!isActive && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <p className="text-gray-600 font-medium text-sm text-center">
              This is your Drawing Area.
              <br />
              Hit Start below!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
