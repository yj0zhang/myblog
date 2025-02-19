//基于lodash4
//对象 下划线转驼峰
function camelCase(obj) {
  if (_.isArray(obj)) {
    obj.forEach((v, k) => {
      obj[k] = camelCase(v)
    })
  } else if (_.isObject(obj)) {
    Object.keys(obj).forEach((k) => {
      let ckey = _.camelCase(k);
      console.log(ckey,k)
      obj[ckey] = camelCase(obj[k]);
      delete obj[k]
    })
  }
  return obj;
}

// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}
