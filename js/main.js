// import utilsModule from "./libs/utils";
// import myProxy from "./MyProxy";
// import task from "./task";

import { obj, test, CONSTANE_A } from "./esmodule";
import esmodule2 from "./esmodule2";
obj.a = 2;
obj.b = 3;
delete obj.a;
console.log(obj, test, CONSTANE_A);
esmodule2();
