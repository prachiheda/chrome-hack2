import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

// Explicitly import customsearch_v1 types
import { customsearch_v1 } from 'googleapis/build/src/apis/customsearch/v1';

// Path to your Service Account JSON file
const keyFilePath = path.resolve(__dirname, '../../service-account-key.json');

// Search Engine ID from Google Custom Search
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';

export async function searchCompanyMission(query: string): Promise<string> {
    try {
        // Authenticate using the Service Account JSON
        const auth = new GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        // Create an authenticated client
        const authClient = await auth.getClient();

        // Use the authenticated client with the Custom Search API
        const customSearch = google.customsearch({
            version: 'v1',
            auth: authClient as customsearch_v1.Options['auth'], // Explicitly set type
        });

        // Execute the search query
        const response = await customSearch.cse.list({
            q: query,
            cx: SEARCH_ENGINE_ID,
        });

        // Extract the first result's link
        const firstResult = response.data.items?.[0]?.link || 'No results found';
        return firstResult;
    } catch (error) {
        console.error('Error during search:', error);
        return 'Error occurred during search.';
    }
}
