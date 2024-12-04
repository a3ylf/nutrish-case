import axios from "axios";
import * as cheerio from "cheerio";

interface SupplementData {
  name: string;
  summary: string;
  sections: Array<{ title: string; content: string }>;
}

interface ApiResponse {
  success: boolean;
  data?: SupplementData;
  error?: string;
}

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Connection": "keep-alive"
};

async function fetchExamineData(query: string): Promise<ApiResponse> {
  const baseUrl = "https://examine.com";
  const searchUrl = `${baseUrl}/supplements/${query.toLowerCase()}/?show_conditions=true`;
    console.log(searchUrl)

  try {
    // Fetch the page
    const response = await axios.get(searchUrl, { headers });
    if (response.status === 404) {
      return { success: false, error: "Supplement not found on Examine.com" };
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract relevant data
    const name = $("h1.header-title").text().trim();
    const summary = $("div.summary-box").text().trim() || "No summary available";

    const sections: Array<{ title: string; content: string }> = [];
    $("div.section").each((_, element) => {
      const title = $(element).find("h2").text().trim() || "Unknown Section";
      const content = $(element).find("p").text().trim() || "Content not available";
      sections.push({ title, content });
    });

    const data: SupplementData = { name, summary, sections };

    return { success: true, data };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: `Network error: ${error.message}` };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Entry point
(async () => {
  const query = process.argv[2]?.trim();
  if (!query) {
    console.error(JSON.stringify({ success: false, error: "Query cannot be empty" }, null, 2));
    process.exit(1);
  }

  const result = await fetchExamineData(query);
  console.log(JSON.stringify(result, null, 2));
})();

