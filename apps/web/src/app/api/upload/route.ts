import { cookies } from 'next/headers';
import {
  NextRequest,
  NextResponse,
} from 'next/server';
import { PdfReader } from 'pdfreader';

import { uploadFile } from '@/action/upload-file';
import { supabaseAdmin } from '@neo/supabase';
import { googleGenerate } from '@neo/trigger';
import { runs } from '@trigger.dev/sdk/v3';

async function waitForCompletion(triggerId: string, retries = 5, delay = 10000): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const date = await runs.retrieve(triggerId);
    if (date.status === "COMPLETED") {
      return true;
    }
    if(date.status === "FAILED") {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Tempo limite excedido aguardando a conclusão da tarefa.');
}


export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const bucket = url.searchParams.get("bucket");
  const path = url.searchParams.get("path");
  const filename = url.searchParams.get("filename");
  const eventType = url.searchParams.get("eventType") || null;
  const senderEmail = url.searchParams.get("senderEmail");
  let upload = null;
  let triggerId;
  console.log("Received Parameters:", { bucket, path, filename, eventType, senderEmail });

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const cookieStore = await  cookies();
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || cookieStore.get('token')?.value || null;

  console.log("Token received:", token);

  if (!bucket || !filename) {
    return NextResponse.json(
      { error: 'The parameters "bucket", "path", and "filename" are required.' },
      { status: 400 }
    );
  }

  const data = await req.formData();
  const file = data.get('file');

  console.log("File received:", file );

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded.' },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Token is not provided.' },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Invalid file format. Only PDFs are accepted.' },
      { status: 400 }
    );
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    if (eventType != null && file.type == 'application/pdf') {

      const idFile = filename.replace(".pdf", "");
       upload = await uploadFile({
        fileName: file.name,
        filePath: `${bucket}/${path}`,
        fileType: file.type,
        idFile,
        filesize: file.size,
        lastModified: String(file.lastModified),
        lastModifiedDate: new Date(file.lastModified),
        token,
      });

      console.log("File upload response:", upload);


      if (!upload) {
        return NextResponse.json({ error: "Error uploading " + upload }, { status: 400 });
      }

    }


    if (!upload  && upload != null) {
      return NextResponse.json({ error: "Error uploading " + upload }, { status: 400 });
    }

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path ? `${path}/${filename}` : `${filename}`, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    console.log("Supabase Upload Data:", uploadData);
    if (uploadError) {
      console.error("Error uploading to Supabase:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    if (eventType != null && file.type == 'application/pdf') {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large.' }, { status: 400 });
      }


      
      if (!upload) {
        return NextResponse.json({ error: "Error uploading " + upload }, { status: 400 });
      }

      if(upload){
          const parsedText = await new Promise<string>((resolve, reject) => {
            const textChunks: string[] = [];
            new PdfReader().parseBuffer(fileBuffer, (err, item) => {
              if (err) {
                console.error('Error parsing the PDF:', err);
                return reject(new Error('Error parsing the PDF.'));
              }
              if (!item) {
                return resolve(textChunks.join(' ').replace(/\s+/g, ' ').trim());
              }
              if (item.text) {
                textChunks.push(item.text);
              }
            });
          });

          console.log("Parsed Text from PDF:", parsedText);

          if (!parsedText) {
            return NextResponse.json({ error: 'Damaged PDF' }, { status: 400 });
          }

          const task = await googleGenerate.trigger({
            enterprise: bucket,
            filename,
            prompt: parsedText,
            token,
            eventType,
            senderEmail: senderEmail ? senderEmail : "",
          });

          triggerId = task.id;
          
          console.log("Google Generate Task Response:", task);

          if (!task) {
            return NextResponse.json({ error: "Error: No response received from the generator." + task }, { status: 500 });
          }
      }

    }

    if (eventType != null && file.type == 'application/pdf') {
      if (!triggerId) {
        return NextResponse.json({ error: 'Trigger ID not received from Google Generate.' }, { status: 500 });
      }
      
      const data = await waitForCompletion(triggerId);

      if(!data){
          return NextResponse.json({
            message: 'Error the processed jobs.',
            data,
          }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: 'File uploaded successfully.',
      data,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in file processing:", error);
    return NextResponse.json({ error: 'Error processing the PDF.' }, { status: 500 });
  }
}
