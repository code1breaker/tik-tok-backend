export interface UploadIf {
  filename: string;
  duration: number;
  url: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  visibility: string;
  userId: string;
}

export interface UpdateUploadIf extends UploadIf {
  videoId: string;
  status: string;
}
