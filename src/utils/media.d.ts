export function requestAndGetUserMedia(
    permissions?: { video: any }
  ): Promise<{ success: boolean; error: boolean | Object | string; stream: MediaStream | null }>;
  