export const handleDownload = async (url, name) => {
  if (!url) {
    alert("No image URL available for download");
    return;
  }
  try {
    const imageUrl = url;
    const fileName = name;
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    const hasExtension = fileName.includes(".");
    link.download = hasExtension ? fileName : `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    alert("Download failed. Please try again.");
  }
};
