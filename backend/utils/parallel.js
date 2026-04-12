import 'dotenv/config';

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;
const PARALLEL_BASE_URL = "https://api.parallel.ai";

/**
 * Parallel Search API — searches the web and returns formatted results.
 * Docs: https://docs.parallel.ai/api-reference/search-beta/search
 */
export const parallelSearch = async (query) => {
    try {
        const response = await fetch(`${PARALLEL_BASE_URL}/v1beta/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": PARALLEL_API_KEY,
            },
            body: JSON.stringify({
                objective: query,
                search_queries: [query],
                mode: "fast",
                max_results: 8,
                excerpts: {
                    max_chars_per_result: 5000,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Parallel Search API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();

        // Format search results — only show links
        if (!data.results || data.results.length === 0) {
            return "No search results found. Try rephrasing your query.";
        }

        let formatted = `## 🔍 Search Results\n\n`;
        formatted += `Found **${data.results.length} results** for: *"${query}"*\n\n`;

        data.results.forEach((result, index) => {
            const title = result.title || "Untitled";
            const url = result.url || "";
            formatted += `${index + 1}. [${title}](${url})\n`;
        });

        return formatted;
    } catch (err) {
        console.error("Parallel Search error:", err);
        throw err;
    }
};


/**
 * Parallel Chat Completions API — chat with web-grounded AI.
 * Uses the "core" model for deep research-capable responses.
 * Docs: https://docs.parallel.ai/api-reference/chat-api-beta/chat-completions
 */
export const parallelChat = async (prompt) => {
    try {
        const response = await fetch(`${PARALLEL_BASE_URL}/v1beta/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": PARALLEL_API_KEY,
            },
            body: JSON.stringify({
                model: "core",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Parallel Chat API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();

        // Extract the reply text from the response
        const choice = data.choices?.[0];
        const replyText =
            choice?.message?.content ||
            choice?.delta?.content ||
            "No response from Parallel Chat.";

        return replyText;
    } catch (err) {
        console.error("Parallel Chat error:", err);
        throw err;
    }
};
