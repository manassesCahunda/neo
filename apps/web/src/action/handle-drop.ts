'use client';

import { v4 as uuidv4 } from 'uuid';

import { CompanyDate } from './queryCompany';

export interface FileWithId {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
  file: File;
}

export const handleDrop = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const date = await CompanyDate();
  const bucket = date?.externalId ||  date?.domain?.split('@')[1].split(".")[0];
  const path = 'unknown';
  console.log(date);
  const fileWithId: FileWithId = {
    id: uuidv4(),
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    lastModifiedDate: new Date(file.lastModified).toISOString(),
    file: file,
  };

  const result = await handleFileUpload(fileWithId, bucket, path, onProgress);

  return result;
};

const handleFileUpload = async (
  file: FileWithId,
  bucket: string,
  path: string,
  onProgress?: (progress: number) => void
) => {
  try {
    const fileName = `${uuidv4()}_${file.name}`;
    const formData = new FormData();
    formData.append('file', file.file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/upload?bucket=${bucket}&path=${path}&filename=${fileName}&eventType=app`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    return new Promise<{ message: string; success: boolean }>((resolve) => {
      xhr.onload = () => {

        console.log("Upload response status:", xhr.status);
        console.log("Upload response text:", xhr.responseText);

        if (xhr.status === 200) {
          resolve({
            message: 'Upload successful',
            success: true,
          });
        } else {
          resolve({
            message: xhr.responseText || 'Upload failed',
            success: false,
          });
        }
      };

      xhr.onerror = () => {
        resolve({
          message: 'An error occurred during the upload.',
          success: false,
        });
      };

      xhr.send(formData);
    });
  } catch (error) {
    return {
      message: `Error handling upload: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      success: false,
    };
  }
};
