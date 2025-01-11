import e from "@bundled-es-modules/pdfjs-dist/build/pdf";
import { useRef as r, useEffect as o, useState as a, useMemo as c } from "react";

const Pdf = ({
  file: e,
  onDocumentComplete: a,
  page: c,
  scale: n,
  rotate: s,
  cMapUrl: i,
  cMapPacked: d,
  workerSrc: p,
  withCredentials: h,
}) => {
  const u = r(null);
  const [loading, numPages, error] = usePdf({
    canvasEl: u,
    file: e,
    page: c,
    scale: n,
    rotate: s,
    cMapUrl: i,
    cMapPacked: d,
    workerSrc: p,
    withCredentials: h,
  });

  o(() => {
    a(numPages);
  }, [numPages]);

  return e.createElement("canvas", { ref: u });
};

Pdf.defaultProps = {
  onDocumentComplete: () => {},
};

const usePdf = ({
  canvasEl: t,
  file: r,
  scale: n = 1,
  rotate: l = 0,
  page: s = 1,
  cMapUrl: i,
  cMapPacked: d,
  workerSrc: p = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js",
  withCredentials: h = false,
}) => {
  const [pdf, setPdf] = a();
  const [isLoading, setLoading] = a(true);
  const [error, setError] = a(null);

  o(() => {
    e.GlobalWorkerOptions.workerSrc = p;
  }, [p]);

  o(() => {
    const config = {
      url: r,
      withCredentials: h,
    };

    if (i) {
      config.cMapUrl = i;
      config.cMapPacked = d;
    }

    e.getDocument(config)
      .promise
      .then(setPdf)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [r, h, i, d]);

  o(() => {
    const renderPage = async () => {
      if (pdf) {
        const page = await pdf.getPage(s);
        drawPDF(page);
      }
    };

    renderPage();
  }, [pdf, s, n, l, t]);

  const drawPDF = (page) => {
    const rotation = (page.rotate + l) % 360;
    const dpRatio = window.devicePixelRatio;
    const adjustedScale = n * dpRatio;
    const viewport = page.getViewport({ scale: adjustedScale, rotation });
    const canvas = t.current;

    if (!canvas) return;

    const canvasContext = canvas.getContext("2d");
    canvas.style.width = `${viewport.width / dpRatio}px`;
    canvas.style.height = `${viewport.height / dpRatio}px`;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext,
      viewport,
    };

    page.render(renderContext);
  };

  const loading = c(() => isLoading || !pdf, [isLoading, pdf]);
  const numPages = c(() => (pdf ? pdf._pdfInfo.numPages : null), [pdf]);

  return [loading, numPages, error];
};

export default Pdf;
export { usePdf };
