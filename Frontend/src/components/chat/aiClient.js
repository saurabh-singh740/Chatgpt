// Placeholder AI client; replace with real API integration.
export async function fakeAIReply(prompt) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    return `Echo: ${prompt.slice(0, 400)}`;
}