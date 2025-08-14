'use server';

import {google} from 'googleapis';

const DOC_ID = '1D9iQNCXQrvPOri6vHyvbF14867oB8GcA82H8cjZo_Kc';

/**
 * Fetches the content of a Google Doc.
 * @returns The text content of the Google Doc.
 */
export async function getGoogleDoc(): Promise<string> {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });
    const authClient = await auth.getClient();
    const docs = google.docs({version: 'v1', auth: authClient});

    const doc = await docs.documents.get({
      documentId: DOC_ID,
    });

    return readStructuralElements(doc.data.body?.content);
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw new Error('Failed to fetch Google Doc');
  }
}

/**
 * Reads the content of structural elements from a Google Doc.
 * @param elements The structural elements to read.
 * @returns The text content of the elements.
 */
function readStructuralElements(
  elements: any[] | undefined
): string {
  if (!elements) {
    return '';
  }

  return elements
    .map((element) => {
      if (element.paragraph) {
        return readParagraphElement(element.paragraph);
      }
      return '';
    })
    .join('');
}

/**
 * Reads the content of a paragraph element from a Google Doc.
 * @param paragraph The paragraph element to read.
 * @returns The text content of the paragraph.
 */
function readParagraphElement(paragraph: any): string {
  if (!paragraph.elements) {
    return '';
  }

  return paragraph.elements
    .map((element: any) => {
      return element.textRun?.content || '';
    })
    .join('');
}
