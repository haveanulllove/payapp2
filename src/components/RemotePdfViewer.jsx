import { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { getCachedPdfData } from "../pdfCache";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const MAX_DEVICE_SCALE = 2;
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

function createPageCanvas(viewport) {
  const outputScale = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_SCALE);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  canvas.className = "pdf-page-canvas";
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  context.scale(outputScale, outputScale);

  return { canvas, context };
}

export default function RemotePdfViewer({ src }) {
  const containerRef = useRef(null);
  const pdfDocumentRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    container.replaceChildren();
    pdfDocumentRef.current = null;
    setTotalPages(0);
    setPageNumber(1);
    setZoom(1);

    const loadPdf = async () => {
      try {
        setStatus("loading");
        setErrorMessage("");

        await new Promise((resolve) => window.requestAnimationFrame(resolve));

        const cachedData = await getCachedPdfData(src);

        if (cancelled) {
          return;
        }

        loadingTask = getDocument({ data: cachedData });

        const pdfDocument = await loadingTask.promise;

        if (cancelled) {
          pdfDocument.destroy?.();
          return;
        }

        pdfDocumentRef.current = pdfDocument;
        setTotalPages(pdfDocument.numPages);
        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "PDF load failed");
          setStatus("error");
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
      renderTaskRef.current = null;
      loadingTask?.destroy?.();
      pdfDocumentRef.current?.destroy?.();
      pdfDocumentRef.current = null;
      container.replaceChildren();
    };
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    const pdfDocument = pdfDocumentRef.current;

    if (!container || !pdfDocument || status !== "ready") {
      return undefined;
    }

    const renderPage = async () => {
      try {
        renderTaskRef.current?.cancel?.();
        renderTaskRef.current = null;
        container.replaceChildren();

        const page = await pdfDocument.getPage(pageNumber);

        if (cancelled) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = container.clientWidth || 360;
        const viewport = page.getViewport({
          scale: (availableWidth / baseViewport.width) * zoom,
        });
        const pageElement = document.createElement("section");
        pageElement.className = "pdf-page";

        const { canvas, context } = createPageCanvas(viewport);
        pageElement.appendChild(canvas);
        container.appendChild(pageElement);

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (error) {
        const isCancelled = cancelled || error?.name === "RenderingCancelledException";
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "PDF render failed");
          setStatus("error");
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
      renderTaskRef.current = null;
    };
  }, [pageNumber, status, zoom]);

  const hasDocument = totalPages > 0 && status === "ready";
  const canGoPrevious = hasDocument && pageNumber > 1;
  const canGoNext = hasDocument && pageNumber < totalPages;

  const goPreviousPage = () => {
    setPageNumber((current) => Math.max(1, current - 1));
  };

  const goNextPage = () => {
    setPageNumber((current) => Math.min(totalPages || current, current + 1));
  };

  const updatePageNumber = (event) => {
    const nextPage = Number(event.target.value);

    if (!Number.isFinite(nextPage)) {
      return;
    }

    setPageNumber(Math.min(Math.max(1, Math.trunc(nextPage)), totalPages || 1));
  };

  const zoomOut = () => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const zoomIn = () => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  return (
    <section className="report-viewer-shell">
      <div className="pdf-toolbar" aria-label="PDF工具栏">
        <button type="button" className="pdf-toolbar-icon" disabled={!canGoPrevious} onClick={goPreviousPage}>
          {"<"}
        </button>
        <input
          className="pdf-page-input"
          type="number"
          min="1"
          max={totalPages || 1}
          value={pageNumber}
          disabled={!hasDocument}
          onChange={updatePageNumber}
          aria-label="页码"
        />
        <span className="pdf-page-total">/ {totalPages || "-"}</span>
        <button type="button" className="pdf-toolbar-icon" disabled={!canGoNext} onClick={goNextPage}>
          {">"}
        </button>
        <span className="pdf-toolbar-divider" />
        <button type="button" className="pdf-toolbar-icon" disabled={!hasDocument || zoom <= MIN_ZOOM} onClick={zoomOut}>
          -
        </button>
        <button type="button" className="pdf-toolbar-icon" disabled={!hasDocument || zoom >= MAX_ZOOM} onClick={zoomIn}>
          +
        </button>
      </div>
      {status !== "ready" && (
        <div className={`pdf-viewer-status${status === "error" ? " is-error" : ""}`}>
          {status === "loading" ? "PDF加载中..." : errorMessage || "PDF加载失败"}
        </div>
      )}
      <div ref={containerRef} className="pdf-viewer-stack" />
    </section>
  );
}
