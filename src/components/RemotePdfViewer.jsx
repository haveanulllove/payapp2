import { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { getCachedPdfData } from "../pdfCache";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const MAX_DEVICE_SCALE = 2;

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
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;
    let pdfDocument = null;
    const renderTasks = [];
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    container.replaceChildren();

    const renderPdf = async () => {
      try {
        setStatus("loading");
        setErrorMessage("");

        await new Promise((resolve) => window.requestAnimationFrame(resolve));

        const cachedData = await getCachedPdfData(src);

        if (cancelled) {
          return;
        }

        loadingTask = getDocument({ data: cachedData });

        pdfDocument = await loadingTask.promise;

        if (cancelled) {
          return;
        }

        const availableWidth = container.clientWidth || 360;

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          const page = await pdfDocument.getPage(pageNumber);

          if (cancelled) {
            return;
          }

          const baseViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: availableWidth / baseViewport.width });
          const pageElement = document.createElement("section");
          pageElement.className = "pdf-page";

          const { canvas, context } = createPageCanvas(viewport);
          pageElement.appendChild(canvas);
          container.appendChild(pageElement);

          const renderTask = page.render({
            canvasContext: context,
            viewport,
          });

          renderTasks.push(renderTask);
          await renderTask.promise;
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (error) {
        const isCancelled = cancelled || error?.name === "RenderingCancelledException";
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "PDF load failed");
          setStatus("error");
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      renderTasks.forEach((task) => task.cancel?.());
      loadingTask?.destroy?.();
      pdfDocument?.destroy?.();
      container.replaceChildren();
    };
  }, [src]);

  return (
    <section className="report-viewer-shell">
      {status !== "ready" && (
        <div className={`pdf-viewer-status${status === "error" ? " is-error" : ""}`}>
          {status === "loading" ? "PDF加载中..." : errorMessage || "PDF加载失败"}
        </div>
      )}
      <div ref={containerRef} className="pdf-viewer-stack" />
    </section>
  );
}
