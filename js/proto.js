Professor.prototype.tSkill = "JAVA";
function Professor() {}

var p = new Professor();

Teacher.prototype = p;
Teacher.prototype.constructor = Teacher;
function Teacher() {
  this.mSkill = "JS";
  this.students = 500;
  this.address = {
    n: 1,
  };
}

var t = new Teacher();

Student.prototype = t;
Student.prototype.constructor = Student;
function Student() {
  this.pSkill = "HTML";
}
var s = new Student();
s.address.m = 1; //这一行会修改Student的原型t
console.log(s, t);
// 这一行不会修改Student的原型t
// 但是会在s上添加一个新属性，值为501
// 与这个表达式等价： s.students = s.students + 1
s.students++;
console.log(s, t);
