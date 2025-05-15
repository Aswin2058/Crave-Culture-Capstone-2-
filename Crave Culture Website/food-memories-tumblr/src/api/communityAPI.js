export const fetchCommunities = async () => {
    try {
        const res = await fetch('http://localhost:4000/api/community');
        const text = await res.text(); // First get the raw text
        console.log("Raw response:", text); // Log it to see what you're getting
        
        try {
            return JSON.parse(text); // Then try to parse it
        } catch (e) {
            throw new Error(`Invalid JSON: ${text.substring(0, 100)}...`);
        }
    } catch (error) {
        console.error("Error fetching communities:", error);
        throw error;
    }
};

export const addCommunity = async (communityData) => {
    try {
      console.log("Sending:", communityData); // Debug what's being sent
      const res = await fetch('http://localhost:4000/api/community', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communityData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add community');
      }
      
      return await res.json();
    } catch (error) {
      console.error("Add community error:", error);
      throw error;
    }
  };
  
export const reactToCommunity = async (id, type) => {
    const res = await fetch(`/api/community/${id}/react`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
    });
    return res.json();
};
  
export const addComment = async (id, comment) => {
    const res = await fetch(`/api/community/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment }),
    });
    return res.json();
};

// communityAPI.js
export const followCommunity = async (communityId) => {
  const response = await fetch(`/api/communities/${communityId}/follow`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error("Failed to follow community");
  return response.json();
};