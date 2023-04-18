/*export const Fetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let method = 'GET' || options.method;
    xhr.open(method, url);
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve({
          json: () => Promise.resolve(JSON.parse(this.response)),
          text: () => Promise.resolve(this.response),
        });
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send(options.body);
  });
}; */

export const Fetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let method = 'GET' || options.method;
    xhr.open(method, url);
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }

    function onLoadListener() {
      var data = JSON.parse(this.responseText);
      console.log(data);
    }

    function onErrorListener(err) {
      console.log('XHR Error :', err);
    }

    request.onload = onLoadListener;
    request.onerror = onErrorListener;
    request.open('get', 'url', true);
    request.send();
  });
};
