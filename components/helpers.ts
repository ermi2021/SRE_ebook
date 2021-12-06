
import jsPDF from "jspdf";

import { CustomImage } from "./custom-image";

const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

interface ImageDimension {
  width: number;
  height: number;
}

export const imageDimensionsOnA4 = (dimensions: ImageDimension) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

export const fileToImageURL = (file: File): Promise<CustomImage> => {
  return new Promise((resolve, reject) => {
    const image = new CustomImage(file.type);

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Failed to convert File to Image"));
    };

    image.src = URL.createObjectURL(file);
  });
};

export const generatePdfFromImages = (images: CustomImage[], width: number, height: number, porientation: any = 'p', format: any = 'a4', addFirstPage: boolean, fpTitle: any, fSize: any, tPosition: any) => {
  const doc = new jsPDF({
    orientation: porientation,
    unit: 'mm',
    format: format,
    putOnlyUsedFonts: true,
    floatPrecision: 16
  }
  );

  if (!addFirstPage) {
    doc.deletePage(1);
  } else {
    doc.setFontSize(fSize);
    doc.text(fpTitle, tPosition.left, tPosition.top);
  }

  images.forEach((image) => {
    const imageDimensions = imageDimensionsOnA4({
      width: width,
      height: height,
    });

    doc.addPage();
    doc.addImage(
      image.src,
      image.imageType,
      (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
      (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
      imageDimensions.width,
      imageDimensions.height
    );
  });



  return doc;
  // window.open(pdfURL as any, "width=200,height=100");


};



