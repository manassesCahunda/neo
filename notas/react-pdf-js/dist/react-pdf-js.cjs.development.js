import React from 'react';
import pdfjs from '@bundled-es-modules/pdfjs-dist/build/pdf';

const Pdf = ({
  file,
  onDocumentComplete,
  page,
  scale,
  rotate,
  cMapUrl,
  cMapPacked,
  workerSrc,
  withCredentials,
}) => {
  const canvasEl = React.useRef(null);
  const [loading, numPages] = usePdf({
    canvasEl,
    file,
    page,
    scale,
    rotate,
    cMapUrl,
    cMapPacked,
    workerSrc,
    withCredentials,
  });

  React.useEffect(() => {
    onDocumentComplete(numPages);
  }, [numPages]);

  return <canvas ref={canvasEl} style={{ width: '100%', height: 'auto' }} />;
};

Pdf.defaultProps = {
  onDocumentComplete: () => {},
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
  withCredentials = false,
}) => {
  const [pdf, setPdf] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  React.useEffect(() => {
    const config = {
      url: file,
      withCredentials,
    };

    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }

    const loadPdf = async () => {
      try {
        const loadedPdf = await pdfjs.getDocument(config).promise;
        setPdf(loadedPdf);
        setLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };

    loadPdf();
  }, [file, withCredentials, cMapUrl, cMapPacked]);

  const renderPage = async () => {
    if (pdf && canvasEl.current) {
      const p = await pdf.getPage(page);
      await drawPDF(p);
    }
  };

  const drawPDF = async (page) => {
    const rotation = (page.rotate + rotate) % 360;
    const dpRatio = window.devicePixelRatio;
    const adjustedScale = scale * dpRatio;
    const viewport = page.getViewport({ scale: adjustedScale, rotation });
    const canvas = canvasEl.current;

    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext,
      viewport,
    };

    await page.render(renderContext).promise;
  };

  const numPages = React.useMemo(() => (pdf ? pdf.numPages : null), [pdf]);

  React.useEffect(() => {
    renderPage();
  }, [pdf, page, scale, rotate]);

  const handleResize = React.useCallback(() => {
    if (pdf && canvasEl.current) {
      renderPage();
    }
  }, [pdf, page, scale, rotate]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return [loading, numPages];
};

export default Pdf;
export { usePdf };
