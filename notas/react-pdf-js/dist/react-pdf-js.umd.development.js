(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@bundled-es-modules/pdfjs-dist/build/pdf'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', '@bundled-es-modules/pdfjs-dist/build/pdf', 'react'], factory) :
  (global = global || self, factory(global['react-pdf-js'] = {}, global.pdfjs, global.React));
}(this, function (exports, pdfjs, React) {
  'use strict';

  pdfjs = pdfjs && pdfjs.hasOwnProperty('default') ? pdfjs['default'] : pdfjs;
  var React__default = 'default' in React ? React['default'] : React;

  const Pdf = ({
    file,
    onDocumentComplete,
    page,
    scale,
    rotate,
    cMapUrl,
    cMapPacked,
    workerSrc,
    withCredentials
  }) => {
    const canvasEl = React.useRef(null);
    const [, numPages] = usePdf({
      canvasEl,
      file,
      page,
      scale,
      rotate,
      cMapUrl,
      cMapPacked,
      workerSrc,
      withCredentials
    });

    React.useEffect(() => {
      onDocumentComplete(numPages);
    }, [numPages]);

    return React__default.createElement("canvas", {
      ref: canvasEl
    });
  };

  Pdf.defaultProps = {
    onDocumentComplete: () => {}
  };

  const usePdf = ({
    canvasEl,
    file,
    scale = 1,
    rotate = 0,
    page = 1,
    cMapUrl,
    cMapPacked,
    workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js',
    withCredentials = false
  }) => {
    const [pdf, setPdf] = React.useState();

    React.useEffect(() => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    }, []);

    React.useEffect(() => {
      const config = {
        url: file,
        withCredentials
      };

      if (cMapUrl) {
        config.cMapUrl = cMapUrl;
        config.cMapPacked = cMapPacked;
      }

      pdfjs.getDocument(config).promise.then(setPdf);
    }, [file, withCredentials]);

    React.useEffect(() => {
      if (pdf) {
        pdf.getPage(page).then(p => drawPDF(p));
      }
    }, [pdf, page, scale, rotate, canvasEl]);

    const drawPDF = page => {
      const rotation = (page.rotate + rotate) % 360;
      const dpRatio = window.devicePixelRatio;
      const adjustedScale = scale * dpRatio;
      const viewport = page.getViewport({
        scale: adjustedScale,
        rotation
      });
      const canvas = canvasEl.current;

      if (!canvas) {
        return;
      }

      const canvasContext = canvas.getContext('2d');
      canvas.style.width = `${viewport.width / dpRatio}px`;
      canvas.style.height = `${viewport.height / dpRatio}px`;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext,
        viewport
      };
      page.render(renderContext);
    };

    const loading = React.useMemo(() => !pdf, [pdf]);
    const numPages = React.useMemo(() => pdf ? pdf._pdfInfo.numPages : null, [pdf]);
    
    return [loading, numPages];
  };

  exports.default = Pdf;
  exports.usePdf = usePdf;
}));
