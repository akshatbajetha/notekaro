"use client";

import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CanvasEngine } from "@/canvas-engine/CanvasEngine";

import {
  BgFill,
  canvasBgDark,
  canvasBgLight,
  FillStyle,
  FontFamily,
  FontSize,
  LOCALSTORAGE_CANVAS_KEY,
  RoughStyle,
  StrokeEdge,
  StrokeFill,
  StrokeStyle,
  StrokeWidth,
  TextAlign,
  ToolType,
} from "@/types/canvas";
import { MobileCommandBar } from "./MobileCommandBar";
import ScreenLoading from "./ScreenLoading";
import AppMenuButton from "./AppMenuButton";
import { AppSidebar } from "./AppSidebar";
import { StyleConfigurator } from "./StyleConfigurator";
import ToolSelector from "./ToolSelector";
import ZoomControl from "./ZoomControl";

export default function CanvasBoard() {
  const { theme } = useTheme();
  const { matches, isLoading } = useMediaQuery(670);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngineState, setCanvasEngineState] = useState({
    engine: null as CanvasEngine | null,
    scale: 1,
    activeTool: "grab" as ToolType,
    strokeFill: "#f08c00" as StrokeFill,
    strokeWidth: 1 as StrokeWidth,
    bgFill: "#00000000" as BgFill,
    strokeEdge: "round" as StrokeEdge,
    strokeStyle: "solid" as StrokeStyle,
    roughStyle: 1 as RoughStyle,
    fillStyle: "solid" as FillStyle,
    fontFamily: "hand-drawn" as FontFamily,
    fontSize: "Medium" as FontSize,
    textAlign: "left" as TextAlign,
    grabbing: false,
    sidebarOpen: false,
    canvasColor: canvasBgLight[0],
    isCanvasEmpty: true,
  });

  useEffect(() => {
    setCanvasEngineState((prev) => ({
      ...prev,
      canvasColor: theme === "dark" ? canvasBgDark[0] : canvasBgLight[0],
    }));
    console.log("Theme = ", theme);
  }, [theme]);

  useEffect(() => {
    if (canvasEngineState.engine && theme) {
      canvasEngineState.engine.setTheme(theme === "light" ? "light" : "dark");
    }
  }, [theme, canvasEngineState.engine]);

  useEffect(() => {
    const storedShapes = localStorage.getItem(LOCALSTORAGE_CANVAS_KEY);
    const isEmpty = !storedShapes || JSON.parse(storedShapes).length === 0;

    setCanvasEngineState((prev) => ({
      ...prev,
      isCanvasEmpty: isEmpty,
    }));
  }, []);

  useEffect(() => {
    const { engine, scale } = canvasEngineState;
    if (engine) {
      engine.setScale(scale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEngineState.engine, canvasEngineState.scale]);

  useEffect(() => {
    const {
      engine,
      activeTool,
      strokeWidth,
      strokeFill,
      bgFill,
      canvasColor,
      strokeEdge,
      strokeStyle,
      roughStyle,
      fillStyle,
      fontFamily,
      fontSize,
      textAlign,
    } = canvasEngineState;

    if (engine) {
      engine.setTool(activeTool);
      engine.setStrokeWidth(strokeWidth);
      engine.setStrokeFill(strokeFill);
      engine.setBgFill(bgFill);
      engine.setCanvasBgColor(canvasColor);
      engine.setStrokeEdge(strokeEdge);
      engine.setStrokeStyle(strokeStyle);
      engine.setRoughStyle(roughStyle);
      engine.setFillStyle(fillStyle);
      engine.setFontFamily(fontFamily);
      engine.setFontSize(fontSize);
      engine.setTextAlign(textAlign);
    }
  }, [canvasEngineState]);

  // TODO: Add keyboard shortcuts for tools
  // const handleKeyDown = useCallback((e: KeyboardEvent) => {
  //   const toolKeyMap: Record<string, ToolType> = {
  //     "1": "selection",
  //     "2": "grab",
  //     "3": "rectangle",
  //     "4": "ellipse",
  //     "5": "diamond",
  //     "6": "line",
  //     "7": "free-draw",
  //     "8": "arrow",
  //     "9": "text",
  //     "0": "eraser",
  //   };

  //   const newTool = toolKeyMap[e.key];
  //   if (newTool) {
  //     setCanvasEngineState((prev) => ({ ...prev, activeTool: newTool }));
  //   }
  // }, []);

  useEffect(() => {
    const checkCanvasInterval = setInterval(() => {
      if (canvasRef.current) {
        setIsCanvasReady(true);
        clearInterval(checkCanvasInterval);
      }
    }, 100);

    return () => clearInterval(checkCanvasInterval);
  }, []);

  const initializeCanvasEngine = useCallback(() => {
    if (!canvasRef.current) return null;

    const engine = new CanvasEngine(
      canvasRef.current,
      canvasEngineState.canvasColor,
      (newScale) =>
        setCanvasEngineState((prev) => ({ ...prev, scale: newScale })),
      theme === "light" ? "light" : "dark"
    );
    engine.setOnShapeCountChange((count: number) => {
      setCanvasEngineState((prev) => ({
        ...prev,
        isCanvasEmpty: count === 0,
      }));
    });
    return engine;
  }, [canvasEngineState.canvasColor, theme]);

  useEffect(() => {
    if (!isCanvasReady) return;
    const engine = initializeCanvasEngine();
    if (engine) {
      setCanvasEngineState((prev) => ({ ...prev, engine }));
    }
  }, [isCanvasReady, initializeCanvasEngine]);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasEngineState.engine) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        canvasEngineState.engine.handleResize(
          window.innerWidth,
          window.innerHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEngineState.engine]);

  const clearCanvas = useCallback(() => {
    canvasEngineState.engine?.clearAllShapes();
  }, [canvasEngineState.engine]);

  const toggleSidebar = useCallback(() => {
    setCanvasEngineState((prev) => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen,
    }));
  }, []);

  const handleScaleUpdate = useCallback(
    (newScale: number | ((prev: number) => number)) => {
      setCanvasEngineState((prev) => {
        const finalScale =
          typeof newScale === "function" ? newScale(prev.scale) : newScale;

        if (prev.engine) {
          prev.engine.setScale(finalScale); // 🔥 this handles panX, panY, canvas.clear
        }

        return {
          ...prev,
          scale: finalScale,
        };
      });
    },
    []
  );

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <div
      className={cn(
        "h-screen overflow-hidden",
        canvasEngineState.activeTool === "eraser"
          ? "cursor-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAOBJREFUOE9jZKAyYKSyeQzDwMD////7MDAw6EGD5hIjI+MWfMGE08sggz5+/Dj71q1bHPv27eMFGeLk5PRZTU3tBz8/fyoug7EaCDLs58+fa0NDQ9k2b96M4iBfX1+G1atX/2JnZw/GZihWAz98+PA8NjZWAt0wmMkgQxcvXvxCQEBAEt37GAaCXHf69OnFZmZmAvjC6tSpUx9MTU1j0V2JzcCqzs7OpoqKCmZ8BnZ0dPwtLy+vY2RkbENWRxcDqetlkPOpGikgA6mebGCGUi1hI8ca1bIeucXaMCi+SPU6AHRTjhWg+vuGAAAAAElFTkSuQmCC')_10_10,auto]"
          : canvasEngineState.activeTool === "grab" &&
              !canvasEngineState.sidebarOpen
            ? canvasEngineState.grabbing
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-crosshair"
      )}
    >
      <div className="App_Menu App_Menu_Top fixed z-[4] top-4 right-4 left-4 flex justify-center items-center xs670:grid xs670:grid-cols-[1fr_auto_1fr] xs670:gap-4 md:gap-8 xs670:items-start">
        {matches && (
          <div className="Main_Menu_Stack Sidebar_Trigger_Button xs670:grid xs670:gap-[calc(.25rem*6)] grid-cols-[auto] grid-flow-row grid-rows auto-rows-min justify-self-start">
            <div className="relative">
              <AppMenuButton onClick={toggleSidebar} />

              {canvasEngineState.sidebarOpen && (
                <AppSidebar
                  isOpen={canvasEngineState.sidebarOpen}
                  onClose={() =>
                    setCanvasEngineState((prev) => ({
                      ...prev,
                      sidebarOpen: false,
                    }))
                  }
                  canvasColor={canvasEngineState.canvasColor}
                  setCanvasColor={(newCanvasColor: SetStateAction<string>) =>
                    setCanvasEngineState((prev) => ({
                      ...prev,
                      canvasColor:
                        typeof newCanvasColor === "function"
                          ? newCanvasColor(prev.canvasColor)
                          : newCanvasColor,
                    }))
                  }
                  onClearCanvas={clearCanvas}
                />
              )}
            </div>

            <StyleConfigurator
              activeTool={canvasEngineState.activeTool}
              strokeFill={canvasEngineState.strokeFill}
              setStrokeFill={(newStrokeFill: SetStateAction<StrokeFill>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  strokeFill:
                    typeof newStrokeFill === "function"
                      ? newStrokeFill(prev.strokeFill)
                      : newStrokeFill,
                }))
              }
              strokeWidth={canvasEngineState.strokeWidth}
              setStrokeWidth={(newStrokeWidth: SetStateAction<StrokeWidth>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  strokeWidth:
                    typeof newStrokeWidth === "function"
                      ? newStrokeWidth(prev.strokeWidth)
                      : newStrokeWidth,
                }))
              }
              bgFill={canvasEngineState.bgFill}
              setBgFill={(newBgFill: SetStateAction<BgFill>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  bgFill:
                    typeof newBgFill === "function"
                      ? newBgFill(prev.bgFill)
                      : newBgFill,
                }))
              }
              strokeEdge={canvasEngineState.strokeEdge}
              setStrokeEdge={(newStrokeEdge: SetStateAction<StrokeEdge>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  strokeEdge:
                    typeof newStrokeEdge === "function"
                      ? newStrokeEdge(prev.strokeEdge)
                      : newStrokeEdge,
                }))
              }
              strokeStyle={canvasEngineState.strokeStyle}
              setStrokeStyle={(newStrokeStyle: SetStateAction<StrokeStyle>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  strokeStyle:
                    typeof newStrokeStyle === "function"
                      ? newStrokeStyle(prev.strokeStyle)
                      : newStrokeStyle,
                }))
              }
              roughStyle={canvasEngineState.roughStyle}
              setRoughStyle={(newRoughStyle: SetStateAction<RoughStyle>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  roughStyle:
                    typeof newRoughStyle === "function"
                      ? newRoughStyle(prev.roughStyle)
                      : newRoughStyle,
                }))
              }
              fillStyle={canvasEngineState.fillStyle}
              setFillStyle={(newFillStyle: SetStateAction<FillStyle>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  fillStyle:
                    typeof newFillStyle === "function"
                      ? newFillStyle(prev.fillStyle)
                      : newFillStyle,
                }))
              }
              fontFamily={canvasEngineState.fontFamily}
              setFontFamily={(newFontFamily: SetStateAction<FontFamily>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  fontFamily:
                    typeof newFontFamily === "function"
                      ? newFontFamily(prev.fontFamily)
                      : newFontFamily,
                }))
              }
              fontSize={canvasEngineState.fontSize}
              setFontSize={(newFontSize: SetStateAction<FontSize>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  fontSize:
                    typeof newFontSize === "function"
                      ? newFontSize(prev.fontSize)
                      : newFontSize,
                }))
              }
              textAlign={canvasEngineState.textAlign}
              setTextAlign={(newTextAlign: SetStateAction<TextAlign>) =>
                setCanvasEngineState((prev) => ({
                  ...prev,
                  textAlign:
                    typeof newTextAlign === "function"
                      ? newTextAlign(prev.textAlign)
                      : newTextAlign,
                }))
              }
            />
          </div>
        )}
        <ToolSelector
          selectedTool={canvasEngineState.activeTool}
          onToolSelect={(newTool: SetStateAction<ToolType>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              activeTool:
                typeof newTool === "function"
                  ? newTool(prev.activeTool)
                  : newTool,
            }))
          }
        />
      </div>

      {canvasEngineState.activeTool === "grab"}

      {matches && (
        <ZoomControl
          scale={canvasEngineState.scale}
          setScale={handleScaleUpdate}
        />
      )}

      <div className="notekaroSketch-textEditorContainer"></div>

      {!matches && (
        <MobileCommandBar
          sidebarOpen={canvasEngineState.sidebarOpen}
          setSidebarOpen={() =>
            setCanvasEngineState((prev) => ({
              ...prev,
              sidebarOpen: !prev.sidebarOpen,
            }))
          }
          canvasColor={canvasEngineState.canvasColor}
          setCanvasColor={(newCanvasColor: SetStateAction<string>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              canvasColor:
                typeof newCanvasColor === "function"
                  ? newCanvasColor(prev.canvasColor)
                  : newCanvasColor,
            }))
          }
          scale={canvasEngineState.scale}
          setScale={(newScale: SetStateAction<number>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              scale:
                typeof newScale === "function"
                  ? newScale(prev.scale)
                  : newScale,
            }))
          }
          activeTool={canvasEngineState.activeTool}
          setStrokeFill={(newStrokeFill: SetStateAction<StrokeFill>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              strokeFill:
                typeof newStrokeFill === "function"
                  ? newStrokeFill(prev.strokeFill)
                  : newStrokeFill,
            }))
          }
          strokeFill={canvasEngineState.strokeFill}
          strokeWidth={canvasEngineState.strokeWidth}
          setStrokeWidth={(newStrokeWidth: SetStateAction<StrokeWidth>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              strokeWidth:
                typeof newStrokeWidth === "function"
                  ? newStrokeWidth(prev.strokeWidth)
                  : newStrokeWidth,
            }))
          }
          bgFill={canvasEngineState.bgFill}
          setBgFill={(newBgFill: SetStateAction<BgFill>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              bgFill:
                typeof newBgFill === "function"
                  ? newBgFill(prev.bgFill)
                  : newBgFill,
            }))
          }
          strokeEdge={canvasEngineState.strokeEdge}
          setStrokeEdge={(newStrokeEdge: SetStateAction<StrokeEdge>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              strokeEdge:
                typeof newStrokeEdge === "function"
                  ? newStrokeEdge(prev.strokeEdge)
                  : newStrokeEdge,
            }))
          }
          strokeStyle={canvasEngineState.strokeStyle}
          setStrokeStyle={(newStrokeStyle: SetStateAction<StrokeStyle>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              strokeStyle:
                typeof newStrokeStyle === "function"
                  ? newStrokeStyle(prev.strokeStyle)
                  : newStrokeStyle,
            }))
          }
          roughStyle={canvasEngineState.roughStyle}
          setRoughStyle={(newRoughStyle: SetStateAction<RoughStyle>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              roughStyle:
                typeof newRoughStyle === "function"
                  ? newRoughStyle(prev.roughStyle)
                  : newRoughStyle,
            }))
          }
          fillStyle={canvasEngineState.fillStyle}
          setFillStyle={(newFillStyle: SetStateAction<FillStyle>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              fillStyle:
                typeof newFillStyle === "function"
                  ? newFillStyle(prev.fillStyle)
                  : newFillStyle,
            }))
          }
          fontFamily={canvasEngineState.fontFamily}
          setFontFamily={(newFontFamily: SetStateAction<FontFamily>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              fontFamily:
                typeof newFontFamily === "function"
                  ? newFontFamily(prev.fontFamily)
                  : newFontFamily,
            }))
          }
          fontSize={canvasEngineState.fontSize}
          setFontSize={(newFontSize: SetStateAction<FontSize>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              fontSize:
                typeof newFontSize === "function"
                  ? newFontSize(prev.fontSize)
                  : newFontSize,
            }))
          }
          textAlign={canvasEngineState.textAlign}
          setTextAlign={(newTextAlign: SetStateAction<TextAlign>) =>
            setCanvasEngineState((prev) => ({
              ...prev,
              textAlign:
                typeof newTextAlign === "function"
                  ? newTextAlign(prev.textAlign)
                  : newTextAlign,
            }))
          }
          onClearCanvas={clearCanvas}
        />
      )}

      {!isLoading && canvasEngineState.activeTool === "grab"}

      {isLoading && <ScreenLoading />}

      <canvas
        className={cn(
          "notekarosketch notekarosketch-canvas touch-none w-full h-full",
          theme === "dark" ? "notekarosketch-canvas-dark" : ""
        )}
        ref={canvasRef}
      />
    </div>
  );
}
