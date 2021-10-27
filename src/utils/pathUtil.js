function getAsset(fileName) {
  const webBaseUrl = process.env.WEB_BASE_URL;

  console.log("assets: ", `${webBaseUrl}/assets/img/${fileName}`)
  return `${webBaseUrl}/assets/img/${fileName}`;
}

export default {
  getAsset
}