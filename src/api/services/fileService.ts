import HttpClient from "../httpClient";

export const FileService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return HttpClient.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};