export const Fetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let method = 'GET' || options.method;
    xhr.open(method, url);
    if (options.headers) {
      let keys = Object.keys(options.headers);
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    // Setup our listener to process compeleted requests
    xhr.onload = () => {
      // Only run if the request is complete
      if (xhr.readyState !== 4) return;

      // Process our return data
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          json: () => Promise.resolve(JSON.parse(this.response)),
          text: () => Promise.resolve(this.response),
        });
      } else {
        // What to do when the request has failed
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    //xhr.open(method, url);
    xhr.send(options.body);
  });
};
