export function MP(ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(BMap)
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=3.0&ak="+ak+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}


export function loadJs(src) {
  return new Promise((resolve,reject)=>{
    let script = document.createElement('script')
    script.type = "text/javascript"
    script.onload = ()=>{
      resolve()
    }
    script.onerror = ()=>{
      reject()
    }
    script.src= src
    document.getElementsByTagName('body')[0].appendChild(script)
  })
}

