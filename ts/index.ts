import baseType from './src/baseType';
import typeAsserts from './src/typeAsserts';
import functionType from './src/functionType';
import classType from './src/classType';
import interfaceAndGeneric from './src/interfaceAndGeneric';
import crossType from './src/crossType';
import conditionType from './src/conditionBuiltinType';
import objectKeysType from './src/keysBuiltinType';
import infer from './src/infer';
import compatibility from './src/compatibility';
import typeProtected from './src/typeProtected';
import customType from './src/customType';
import { n } from './src/namespace';
import myDecorators from './src/myDecorators';

baseType();
// typeAsserts();
functionType();
classType();
interfaceAndGeneric();
// crossType();
conditionType();
objectKeysType();
infer();
compatibility();
typeProtected();
customType();
console.log(n.Zoo.Dog);

//全局声明了有a，ts不会报错，但实际上没有a，运行时会报错
// console.log('declare:', a);

// import _ from 'lodash';
// _.copy();
// _.withIn();
myDecorators();