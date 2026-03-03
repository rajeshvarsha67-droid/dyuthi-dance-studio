import sharp from 'sharp';

// Claude API Message Types
export interface Message {
    role: 'user' | 'assistant';
    content: string | ContentBlock[];
}

export type ContentBlock =
    | { type: 'text'; text: string }
    | {
        type: 'image';
        source: {
            type: 'base64';
            media_type: string;
            data: string;
        }
    };

/**
 * Resizes a base64 encoded image so its longest side is at most maxDimension.
 * Returns the resized image as a base64 string.
 */
export async function resizeBase64Image(base64Str: string, maxDimension: number = 1568): Promise<string> {
    const buffer = Buffer.from(base64Str, 'base64');

    try {
        const metadata = await sharp(buffer).metadata();

        if (!metadata.width || !metadata.height) {
            return base64Str; // Return original if dimensions can't be read
        }

        const { width, height } = metadata;
        const longestSide = Math.max(width, height);

        if (longestSide <= maxDimension) {
            return base64Str; // Return original if already within limits
        }

        // Calculate new dimensions preserving aspect ratio
        const scaleFactor = maxDimension / longestSide;
        const newWidth = Math.round(width * scaleFactor);
        const newHeight = Math.round(height * scaleFactor);

        const resizedBuffer = await sharp(buffer)
            .resize({
                width: newWidth,
                height: newHeight,
                fit: 'inside', // Preserves aspect ratio, fits within the given box
                withoutEnlargement: true
            })
            .toBuffer();

        return resizedBuffer.toString('base64');
    } catch (error) {
        console.error('Error resizing image:', error);
        return base64Str; // Fallback to original image on error
    }
}

/**
 * Sanitizes a message history array by resizing all base64 images to a maximum dimension
 * of 1568px on the longest side. 
 * This is useful for passing images to APIs like Claude API without exceeding size limits.
 */
export async function sanitizeMessageHistory(messages: Message[]): Promise<Message[]> {
    // Deep clone messages to avoid mutating the original
    const sanitizedMessages: Message[] = JSON.parse(JSON.stringify(messages));

    for (const message of sanitizedMessages) {
        if (Array.isArray(message.content)) {
            for (const block of message.content) {
                if (block.type === 'image' && block.source?.type === 'base64' && block.source?.data) {
                    // Resize the base64 string
                    block.source.data = await resizeBase64Image(block.source.data, 1568);
                }
            }
        }
    }

    return sanitizedMessages;
}
