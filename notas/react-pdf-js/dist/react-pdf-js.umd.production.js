!function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports, require("@bundled-es-modules/pdfjs-dist/build/pdf"), require("react")) :
  "function" == typeof define && define.amd ? define(["exports", "@bundled-es-modules/pdfjs-dist/build/pdf", "react"], t) :
  (e = e || self, t(e["react-pdf-js"] = {}, e.pdfjs, e.React));
}(this, function(e, t, r) {
  "use strict";
  
  t = t && t.hasOwnProperty("default") ? t.default : t;
  var a = "default" in r ? r.default : r;
  
  const Pdf = ({
    file: e,
    onDocumentComplete: t,
    page: o,
    scale: c,
    rotate: n,
    cMapUrl: d,
    cMapPacked: l,
    workerSrc: i,
    withCredentials: f
  }) => {
    const u = r.useRef(null);
    const [, p] = usePdf({ canvasEl: u, file: e, page: o, scale: c, rotate: n, cMapUrl: d, cMapPacked: l, workerSrc: i, withCredentials: f });
    
    r.useEffect(() => { t(p); }, [p]);
    return a.createElement("canvas", { ref: u });
  };

  Pdf.defaultProps = { onDocumentComplete: () => {} };

  const usePdf = ({
    canvasEl: e,
    file: a,
    scale: o = 1,
    rotate: s = 0,
    page: c = 1,
    cMapUrl: n,
    cMapPacked: d,
    workerSrc: l = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js",
    withCredentials: i = !1
  }) => {
    const [f, u] = r.useState();
    
    r.useEffect(() => { t.GlobalWorkerOptions.workerSrc = l; }, []);
    
    r.useEffect(() => {
      const config = { url: a, withCredentials: i };
      if (n) {
        config.cMapUrl = n;
        config.cMapPacked = d;
      }
      t.getDocument(config).promise.then(u);
    }, [a, i]);

    r.useEffect(() => {
      if (f) {
        f.getPage(c).then(e => drawPDF(e));
      }
    }, [f, c, o, s, e]);

    const drawPDF = page => {
      const rotation = s === 0 ? page.rotate : page.rotate + s;
      let dpRatio = window.devicePixelRatio;
      const adjustedScale = o * dpRatio;
      const viewport = page.getViewport({ scale: adjustedScale, rotation });
      const canvas = e.current;
      
      if (!canvas) return;
      
      const canvasContext = canvas.getContext("2d");
      canvas.style.width = `${viewport.width / dpRatio}px`;
      canvas.style.height = `${viewport.height / dpRatio}px`;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = { canvasContext, viewport };
      page.render(renderContext);
    };

    const loading = r.useMemo(() => !f, [f]);
    const numPages = r.useMemo(() => f ? f._pdfInfo.numPages : null, [f]);
    
    return [loading, numPages];
  };

  e.default = Pdf;
  e.usePdf = usePdf;
});
