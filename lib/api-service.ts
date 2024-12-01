import { toast } from '@/components/ui/use-toast';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred');
  }
  return { data: await response.json() };
}

export async function fetchPrivateReports(userEmail: string | undefined) {
  try {
    if (!userEmail) return [];
    const response = await fetch(`/api/getUserHashes?email=${userEmail}&private=true`);
    const data = await handleApiResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching private reports:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch private reports',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchPublicReports(userEmail: string | undefined) {
  try {
    if (!userEmail) return [];
    const response = await fetch(`/api/getUserHashes?email=${userEmail}&private=false`);
    const data = await handleApiResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching public reports:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch public reports',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchReport(hash: string) {
  try {
    const response = await fetch(`/api/reports/${hash}`);
    const data = await handleApiResponse(response);
    console.log("-->", data.data)
    return data.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch report',
      variant: 'destructive',
    });
    return null;
  }
}

export async function saveReport(userEmail: string, hash: string, isPrivate: boolean = true) {
  try {
    const response = await fetch('/api/save_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: userEmail,
        md5_hash: hash,
        private: isPrivate,
      }),
    });
    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('Error saving report:', error);
    toast({
      title: 'Error',
      description: 'Failed to save report',
      variant: 'destructive',
    });
    return null;
  }
}

export async function generateResearch(topic: string, outline?: string, persona?: string) {
  try {
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        outline,
        persona,
      }),
    });
    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('Error generating research:', error);
    toast({
      title: 'Error',
      description: 'Failed to generate research',
      variant: 'destructive',
    });
    return null;
  }
}
export async function fetchNews(hashtag: string, startDate?: string) {
  try {
    const params = new URLSearchParams({
      hashtag,
      ...(startDate && { startDate }),
    });
    
    // Use a different fetch implementation to avoid encoding issues
    const response = await fetch(`/api/news?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch news',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchUserCredits(userId: string) {
  try {
    const response = await fetch(`/api/credits?userId=${userId}`);
    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching credits:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch credits',
      variant: 'destructive',
    });
    return null;
  }
}

export async function fetchUserTags(userId: string) {
  try {
    const response = await fetch(`/api/tags?userId=${userId}`);
    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch tags',
      variant: 'destructive',
    });
    return [];
  }
}