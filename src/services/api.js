
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}?_limit=15`);

    if (!response.ok) {
      throw new Error('Failed to fetch posts from server.');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('API Error:', error.message);
    throw error;
  }
};
