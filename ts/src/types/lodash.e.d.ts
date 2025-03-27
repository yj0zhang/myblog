import _ = require("./lodash");

// 在./lodash的基础上，对lodash进行扩展
declare module "./lodash" {
    function withIn(): void;
}