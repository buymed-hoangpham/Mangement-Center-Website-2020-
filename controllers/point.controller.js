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
            let pointIT = { 
                theory: '',
                practice: ''
            }
            res.render('./point/view', {
                type,
                student: findStudent,
                classId,
                pointIT,
                findClass
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
            let pointLanguage = { 
                listening: '',
                writing: '',
                reading: '',
                speaking: ''
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
        let cefr = (obs == 9) ? "c2" : (obs >= 7.5) ? "c1" : (obs >= 6) ? "b2" : (obs >= 4.5) ? "b1" : "f";
        let data = { theory, practice, obs, cefr, userid: studentId, classid: classId, type };

        if(!pointIT) {
            await PointIT.create(data);
        }
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
        let cefr = (obs == 9) ? "c2" : (obs >= 7.5) ? "c1" : (obs >= 6) ? "b2" : (obs >= 4.5) ? "b1" : "f"; 
        let data = { speaking, listening, reading, writing, obs, cefr, userid: studentId, classid: classId, type };
        
        if(writing < 0 || writing > 9) {
            let errorMessage ='Điểm writing phải từ 0 đến 9!';
            res.render('./point/view', {
                errorMessage,
                type,
                student: findStudent,
                classId,
                pointIT,
                findClass
            })
            return;
        }
        if(listening < 0 || listening > 9) {
            let errorMessage ='Điểm listening phải từ 0 đến 9!';
            res.render('./point/view', {
                errorMessage,
                type,
                student: findStudent,
                classId,
                pointIT,
                findClass
            })
            return;
        }
        if(writing < 0 || writing > 9) {
            let errorMessage ='Điểm writing phải từ 0 đến 9!';
            res.render('./point/view', {
                errorMessage,
                type,
                student: findStudent,
                classId,
                pointIT,
                findClass
            })
            return;
        }
        
        if(listening < 0 || listening > 9) {
            let errorMessage ='Điểm listening phải từ 0 đến 9!';
            res.render('./point/view', {
                errorMessage,
                type,
                student: findStudent,
                classId,
                pointIT,
                findClass
            })
            return;
        }
        if(!pointLanguage) {
            await PointLanguage.create(data);
        }
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