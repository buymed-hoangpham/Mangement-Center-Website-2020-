const moment = require('moment');
const shortid = require('shortid');
const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');

module.exports.render = async(req, res) => {
    let classes = await Class.find();
    let teachers = await Teacher.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(classes.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = 'Search...'
    res.render('./class/index', {
        classes: classes.slice(begin, end),
        teachers,
        count,
        titleLink: 'class',
        pageSize,
        currentPage,
        placeholderSearch
    });
};

module.exports.delete = async(req, res) => {
    let students = await Student.find();
    let teachers = await Teacher.find();

    students = students.filter(student => student.classId.indexOf(req.params.id) !== -1 );
    teachers = teachers.filter(teacher => teacher.classId.indexOf(req.params.id) !== -1 );
    for(let student of students) {
        if(student.classId === req.params.id) {
            student.classId = student.classId.replace(`${req.params.id}`, '');
        }
        (student.classId.indexOf(req.params.id) == 0) 
        ? student.classId = student.classId.replace(`${req.params.id},`, '')
        : student.classId = student.classId.replace(`,${req.params.id}`, '');
        await student.save();
    }
    for(let teacher of teachers) {
        if(teacher.classId === req.params.id) {
            teacher.classId = teacher.classId.replace(`${req.params.id}`, '');
        }
        (teacher.classId.indexOf(req.params.id) == 0) 
        ? teacher.classId = teacher.classId.replace(`${req.params.id},`, '')
        : teacher.classId = teacher.classId.replace(`,${req.params.id}`, '');
        await teacher.save();
    } 
    await Class.findByIdAndRemove(req.params.id);
    res.redirect('back');
};

module.exports.view = async(req, res) => {
    let thisClass = await Class.findById(req.params.id);
    let students = await Student.find();
    let teachers = await Teacher.find();
    let teachersTeachingArr = [];
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    students = students.filter((student) => student.classId.indexOf(req.params.id) !== -1)
    let pageSize = Math.ceil(students.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = 'Search...';
    
    for(let teacher of teachers) {
        if(teacher.classId.indexOf(thisClass.id) != -1)
            teachersTeachingArr.push(teacher.teachername)
    }
    teachersTeachingArr = teachersTeachingArr.join(' & ');
    res.cookie('thisClass', thisClass);
    res.render('./class/view', {
        teachersTeachingArr,
        thisClass,
        teachers,
        moment,
        students: students.slice(begin, end),
        count,
        titleLink: 'class/view/' + req.params.id,
        pageSize,
        currentPage,
        placeholderSearch
    });
};

module.exports.removeStudent = async(req, res) => {
    let student = await Student.findById(req.params.id);
    let classId = student.classId.split(',').filter(i => i != req.cookies.thisClass._id).join(',');
    let newNumber = req.cookies.thisClass.number - 1;
    await Student.findByIdAndUpdate(req.params.id, { classId: classId });
    await Class.findByIdAndUpdate(req.cookies.thisClass, { number: newNumber });
    res.redirect('back');
};

module.exports.create = async(req, res) => {
    let count = 0;
    let students = await Student.find();
    let teachers = await Teacher.find();
    res.render('./class/create', {
        count,
        students,
        teachers
    });
};

module.exports.postCreate = async (req, res) => {
    let count = 0;
    let _id = shortid.generate();
    let students = await Student.find();
    let teachers = await Teacher.find();
    let classname = req.body.classname;
    let teacher = req.body.teachername;
    let type = req.body.type;
    let teacherId = teacher.replace('Id: ', '').split(' - Tên: ').shift();
    let arrOption = req.body.optionValue;
    let arrStudentId = [];
    let successMessage = '';
    let errorMessage = '';

    if( arrOption == undefined ) {
        let data = {
            _id,
            classname,
            number: 0,
            type,
            teacherid: teacherId 
        };
        if(teacher != "") {
            let findTeacher = await Teacher.findById(teacherId);
            if(findTeacher.classId == '') {
                findTeacher.classId = classStudy.id;
            }else {
                findTeacher.classId += `,${classStudy.id}`;
            }
            await Teacher.findByIdAndUpdate(teacherId, { classId: findTeacher.classId });
        }
        await Class.create(data);
        let classStudy = await Class.findOne({ classname: classname });
        await Teacher.findOneAndUpdate({ _id: teacherId },
            { classId: classStudy.id }
        );
        classStudy ? successMessage = 'Tạo lớp mới thành công!' : errorMessage = 'Tạo lớp mới thất bại!';
    } else {
        let data = {
            _id,
            classname,
            number: arrOption.length,
            type,
            teacherid: teacherId 
        };
        await Class.create(data);
        let classStudy = await Class.findOne({ classname: classname });
        let findTeacher = await Teacher.findById(teacherId);
        if(teacher != "") {
            if(findTeacher.classId == '') {
                findTeacher.classId = classStudy.id;
            }else {
                findTeacher.classId += `,${classStudy.id}`;
            }
            await Teacher.findByIdAndUpdate(teacherId, { classId: findTeacher.classId });
        }
        for(var i = 0; i < arrOption.length; i++) {
            arrStudentId.push(arrOption[i].replace('Id: ', '').split(' - Tên: ').shift());
        }
        for(let item of arrStudentId) {
            let findStudent = await Student.findById(item);
            findStudent.classId += `,${classStudy.id}`;
            await Student.findByIdAndUpdate(item, { classId: findStudent.classId });
        }
        await Class.findById(classStudy.id) ? successMessage = 'Tạo lớp mới thành công!' : errorMessage = 'Tạo lớp mới thất bại!';
    }
    
    res.render('./class/create', {
        count,
        students,
        successMessage,
        errorMessage,
        teachers
    });
};

module.exports.addStudent = async(req, res) => {
    let students = await Student.find();
    res.render('./class/addStudent', {
        students
    })
}

module.exports.postAddStudent = async(req, res) => {
    let students = await Student.find();
    let idStudent = req.body.student;
    let student = await Student.findById(idStudent);
    let newClassId = req.cookies.thisClass._id;
    let successMessage = 'Thêm học viên thành công!';
    let findClass = await Class.findById(req.cookies.thisClass._id );
    let addClassId = '';

    if(student.classId.length == 0) {
        addClassId = newClassId;
    }else {
        addClassId = student.classId +',' + newClassId;
    }
    await Student.findByIdAndUpdate(idStudent, { classId: addClassId });
    await Class.findByIdAndUpdate(req.cookies.thisClass._id, { number: findClass.number + 1 });
    student = await Student.findById(idStudent);
    if(student.classId.indexOf(newClassId) == -1) {
        let errorMessage = 'Thêm học viên thất bại!';
        res.render('./class/addStudent', {
            students,
            errorMessage
        })
        return;
    }
    res.render('./class/addStudent', {
        students,
        successMessage
    })
}

module.exports.search = async (req, res) => {
    var q = req.query.q;
    let classes = await Class.find();
    let teachers = await Teacher.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(classes.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = q;

    let matchedClassed = classes.filter( oneclass => {
        return oneclass.classname.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    if(!matchedClassed.length) {
        placeholderSearch = 'Không tìm thấy!';
        res.render('./class/index', {
            classes: classes.slice(begin, end),
            teachers,
            count,
            titleLink: 'class',
            pageSize,
            currentPage,
            placeholderSearch
        });
        return;
    }
    res.render('./class/index', {
        classes: matchedClassed.slice(begin, end),
        teachers,
        count,
        titleLink: 'class',
        pageSize,
        currentPage,
        placeholderSearch
    });
}

module.exports.searchStudent = async (req, res) => {
    let q = req.query.q;
    let thisClass = await Class.findById(req.cookies.thisClass._id);
    let students = await Student.find();
    let teachers = await Teacher.find();
    let teachersTeachingArr = [];
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(students.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = q;

    for(let teacher of teachers) {
        if(teacher.classId.indexOf(thisClass.id) != -1)
            teachersTeachingArr.push(teacher.teachername)
    }
    teachersTeachingArr = teachersTeachingArr.join(' & ');
    let matchedStudents = students.filter( student => {
        return student.studentname.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    if(!matchedStudents.length) {
        placeholderSearch = 'Không tìm thấy!';
        res.render('./class/view', {
            teachersTeachingArr,
            thisClass,
            teachers,
            moment,
            students: students.slice(begin, end),
            count,
            titleLink: 'class/view/' + req.params.id,
            pageSize,
            currentPage,
            placeholderSearch
        });
        return;
    }
    res.render('./class/view', {
        teachersTeachingArr,
        thisClass,
        teachers,
        moment,
        students: matchedStudents.slice(begin, end),
        count,
        titleLink: 'class/view/' + req.params.id,
        pageSize,
        currentPage,
        placeholderSearch
    });

}