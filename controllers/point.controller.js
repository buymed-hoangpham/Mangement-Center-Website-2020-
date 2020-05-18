const PointIT = require('../models/pointIT.model');
const PointLanguage = require('../models/pointLanguage.model');
const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');

module.exports.render = async(req, res) => {
    let classes = await Class.find();
    let students = await Student.find();

    res.render('./point/index', {
        classes,
        students,
    });
};

module.exports.postRender = async (req, res) => {
    let classes = await Class.find();
    let students = await Student.find();
    let type = req.body.type;
    let thisClass = req.body.class;
    let classId = thisClass.replace('Id: ', '').split(' - Tên: ').shift();
    let findClass = await Class.findById(classId)
    let student = req.body.student;
    let studentId = student.replace('Id: ', '').split(' - Tên: ').shift();
    let findStudent = await Student.findById(studentId);
    let pointIT = await PointIT.findOne({ userid: studentId, classid: classId });
    let pointLanguage = await PointLanguage.findOne({ userid: studentId, classid: classId });

    if(type=="T") {
        if( ! pointIT ) {
            let errorMessage = 'Không có dữ liệu học viên!';
            res.render('./point/index', {
                errorMessage,
                classes,
                students,
            });
            return;
        }
        res.render('./point/view', {
            type,
            student: findStudent,
            classId,
            pointIT,
            findClass
        });
        return;
    } else {
        if( ! pointLanguage ) {
            let errorMessage = 'Không có dữ liệu học viên!';
            res.render('./point/index', {
                errorMessage,
                classes,
                students,
            });
            return;
        }
        res.render('./point/view', {
            type,
            student: findStudent,
            classId,
            pointLanguage,
            findClass
        });
        return;
    }
};

module.exports.postView = async (req, res) => {
    let classes = await Class.find();
    let students = await Student.find();
    let type = req.body.type;
    let studentId = req.body.studentId;
    let findStudent = await Student.findById(studentId);
    let classId = req.body.classId;
    let findClass = await Class.findById(classId)
    let pointIT = await PointIT.findOne({ userid: studentId, classid: classId });
    let pointLanguage = await PointLanguage.findOne({ userid: studentId, classid: classId });
    let successMessage = 'Cập nhật thành công!';

    if(type=="T") {
        let theory =  parseInt(req.body.theory);
        let practice =  parseInt(req.body.practice);
        let obs = (theory + practice) / 2;
        let cefr = obs <4 ? "f" : obs >= 4 ? "b1" : obs >= 5.5 ? "b2" : ( obs >= 7 && obs <9 ) ? "c1" : "c2";
        let data = { theory, practice, obs, cefr };

        await PointIT.findOneAndUpdate({ userid: studentId }, data );
        pointIT = await PointIT.findOne({ userid: studentId, classid: classId });
        res.render('./point/view', {
            successMessage,
            type,
            student: findStudent,
            classId,
            pointIT,
            findClass
        });
        return;
    }
    else {
        let speaking = parseInt(req.body.speaking);
        let listening =  parseInt(req.body.listening);
        let reading =  parseInt(req.body.reading);
        let writing =  parseInt(req.body.writing);
        let obs = (speaking + speaking + reading + writing) / 4;
        let cefr = obs <4 ? "f" : obs >= 4 ? "b1" : obs >= 5.5 ? "b2" : ( obs >= 7 && obs <9 ) ? "c1" : "c2";
        let data = { speaking, listening, reading, writing, obs, cefr };
        
        await PointLanguage.findOneAndUpdate({ userid: studentId }, data );
        pointLanguage = await PointLanguage.findOne({ userid: studentId, classid: classId });
        res.render('./point/view', {
            successMessage,
            type,
            student: findStudent,
            classId,
            pointLanguage,
            findClass
        });
        return;
    }
}

module.exports.view = async (req, res) => {
    let student = await Student.findById(req.params.id);
    let findClass = await Class.findById(student.classId);

    if(findClass.type == "T") {
        let pointIT = await PointIT.findOne({ userid: req.params.id, classid: findClass.id });
        res.render('./point/view', { 
            type: findClass.type,
            student,
            classId: findClass.id,
            pointIT,
            findClass
        })
        return;
    }
    let pointLanguage = await PointLanguage.findOne({ userid: req.params.id, classid: findClass.id });
    res.render('./point/view', { 
        type: findClass.type,
        student,
        classId: findClass.id,
        pointLanguage,
        findClass
    })
}