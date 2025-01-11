import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

type HookProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    file: string;
    onDocumentLoadSuccess?: (document: PDFDocumentProxy) => void;
    onDocumentLoadFail?: () => void;
    onPageLoadSuccess?: (page: PDFPageProxy) => void;
    onPageLoadFail?: () => void;
    onPageRenderSuccess?: (page: PDFPageProxy) => void;
    onPageRenderFail?: () => void;
    scale?: number;
    rotate?: number;
    page?: number;
    cMapUrl?: string;
    cMapPacked?: boolean;
    workerSrc?: string;
    withCredentials?: boolean;
};

type HookReturnValues = {
    pdfDocument: PDFDocumentProxy | undefined;
    pdfPage: PDFPageProxy | undefined;
};

const usePdf = ({
    canvasRef,
    file,
    onDocumentLoadSuccess,
    onDocumentLoadFail,
    onPageLoadSuccess,
    onPageLoadFail,
    onPageRenderSuccess,
    onPageRenderFail,
    scale = 1,
    rotate = 0,
    page = 1,
    cMapUrl,
    cMapPacked,
    workerSrc,
    withCredentials,
}: HookProps): HookReturnValues => {


    return {
        pdfDocument: undefined,
        pdfPage: undefined, 
    };
};

export { usePdf };
