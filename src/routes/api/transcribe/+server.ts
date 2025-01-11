import { error, json } from '@sveltejs/kit';
import { GOOGLE_API_KEY } from '$env/static/private';

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio');
        const systemPrompt = formData.get('systemPrompt') || "Generate audio diarization, including transcriptions and speaker information for each transcription, for this interview. Organize the transcription by the time they happened.";
        const temperature = Number(formData.get('temperature')) || 0.6;

        if (!audioFile || !(audioFile instanceof File)) {
            throw error(400, 'No audio file provided');
        }

        // Convert audio file to base64
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        const requestBody = {
            contents: [{
                parts: [{
                    text: systemPrompt
                }, {
                    inline_data: {
                        mime_type: audioFile.type || 'audio/mpeg',
                        data: base64Audio
                    }
                }]
            }],
            generationConfig: {
                temperature: temperature,
                topP: 1,
                topK: 32,
                maxOutputTokens: 4096,
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw error(response.status, errorData.error?.message || 'Failed to transcribe audio');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No transcription generated';

        return json({ text });
    } catch (err) {
        console.error('Transcription error:', err);
        throw error(500, err instanceof Error ? err.message : 'Failed to transcribe audio');
    }
}
