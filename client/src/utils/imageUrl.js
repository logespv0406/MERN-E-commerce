export const optimizeImage = (url, width = 400) => {
  if (!url) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};