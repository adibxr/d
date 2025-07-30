
'use server';

const DOC_URL = 'https://docs.google.com/document/d/1D9iQNCXQrvPOri6vHyvbF14867oB8GcA82H8cjZo_Kc/export?format=txt';

/**
 * Fetches the content of the "About Me" Google Doc.
 * @returns The text content of the document.
 */
export async function getAboutMeDoc(): Promise<string> {
    try {
        const response = await fetch(DOC_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch doc: ${response.statusText}`);
        }
        const textContent = await response.text();
        // The exported text might have some weird characters or formatting, clean it up a bit.
        return textContent.replace(/\r\n/g, '\n').trim();
    } catch (error) {
        console.error("Error fetching about me document from Google Docs:", error);
        return "I'm sorry, I'm having trouble accessing my knowledge base right now. Please try again in a moment.";
    }
}
