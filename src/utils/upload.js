const isObj = obj => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * fetch上传文件
 * @param url
 * @param opt
 * @returns {Promise<any>}
 */
export default function fetchUpload(url, opt) {
    return new Promise((resolve, reject) => {
        if (!isObj(opt)) {
            opt = {};
        }
        let headers = new Headers();
        if (isObj(opt.headers)) {
            for (let k in opt.headers) {
                headers.set(k, opt.headers[k]);
            }
        }
        Reflect.deleteProperty(opt, 'headers');
        let req = new Request(url, {
            method: 'POST',
            headers,
            ...opt
        });
        fetch(req).then(res => {
            if (res.ok) {
                resolve(res.json());
            }
        }).catch(err => {
            reject(err);
        });
    });
}