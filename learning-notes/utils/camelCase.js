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
