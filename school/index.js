var klass=require('./klass');
// klass.add('zt',['aa','bb']);
exports.add=function (klasses) {
    klasses.forEach( function(item, index) {
        var _klass=item;
        var teacherName=item.teacherName;
        var students=item.students;

        klass.add(teacherName,students);
    });
};