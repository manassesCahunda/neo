"use strict";
function e(e) {
  return e && "object" == typeof e && "default" in e ? e.default : e;
}

var t = e(require("@bundled-es-modules/pdfjs-dist/build/pdf")),
  r = require("react"),
  a = e(r);

const Pdf = ({
  file: e,
  onDocumentComplete: t,
  page: c,
  scale: s,
  rotate: n,
  cMapUrl: l,
  cMapPacked: i,
  workerSrc: d,
  withCredentials: u
}) => {
  const f = r.useRef(null);
  const [loading, numPages] = usePdf({
    canvasEl: f,
    file: e,
    page: c,
    scale: s,
    rotate: n,
    cMapUrl: l,
    cMapPacked: i,
    workerSrc: d,
    withCredentials: u
  });

  r.useEffect(() => {
    t(numPages);
  }, [numPages]);

  return a.createElement("canvas", { ref: f, style: { width: '100%', height: 'auto' } });
};

Pdf.defaultProps = {
  onDocumentComplete: () => {}
};

const usePdf = ({
  canvasEl: e,
  file: a,
  scale: c = 1,
  rotate: o = 0,
  page: s = 1,
  cMapUrl: n,
  cMapPacked: l,
  workerSrc: i = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js",
  withCredentials: d = false
}) => {
  const [pdf, setPdf] = r.useState();
  const [isRendering, setIsRendering] = r.useState(false);

  r.useEffect(() => {
    t.GlobalWorkerOptions.workerSrc = i;
  }, [i]);

  r.useEffect(() => {
    const config = {
      url: a,
      withCredentials: d
    };
    if (n) {
      config.cMapUrl = n;
      config.cMapPacked = l;
    }

    t.getDocument(config).promise.then(setPdf);
  }, [a, d, n, l]);

  r.useEffect(() => {
    const renderPage = async () => {
      if (pdf) {
        setIsRendering(true);
        const page = await pdf.getPage(s);
        await drawPDF(page);
        setIsRendering(false);
      }
    };

    renderPage();
  }, [pdf, s, c, o]);

  const drawPDF = async (page) => {
    const rotation = (page.rotate + o) % 360;
    const dpRatio = window.devicePixelRatio;
    const adjustedScale = c * dpRatio;
    const viewport = page.getViewport({ scale: adjustedScale, rotation });
    const canvas = e.current;

    if (!canvas) return;

    const canvasContext = canvas.getContext("2d");
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext,
      viewport
    };

    await page.render(renderContext).promise;
  };

  const loading = r.useMemo(() => !pdf, [pdf]);
  const numPages = r.useMemo(() => (pdf ? pdf._pdfInfo.numPages : null), [pdf]);

  return [loading, numPages];
};

exports.default = Pdf;
exports.usePdf = usePdf;
