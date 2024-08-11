const catchAsyncError = require("../middleware/catchAsyncError")
const Classroom = require('../models/classroom');
const User = require('../models/user')
const ErrorHandler = require("../utils/ErrorHandler");

const getClassroom = catchAsyncError(async (req, res, next) => {
    const classRoom = await Classroom.find()
        .populate('teacher', '-password -role')
        .populate('students', '-password -role');

    res.status(200).json({
        success: true,
        data: classRoom
    })
})

const createClassroom = catchAsyncError(async (req, res, next) => {
    const { name, teacher, students, schedule } = req.body;
    if (!name)
        return next(new ErrorHandler("Name of classroom missing", 400))

    const classroom = await Classroom.findOne({ name });
    if (classroom)
        return next(new ErrorHandler(`Classroom ${name} already exist`, 400))

    if (teacher) {
        const dublicate = await Classroom.findOne({ teacher })
        if (dublicate)
            return next(new ErrorHandler("Teacher is already assigned to a classroom", 409))
    }

    const classData = await Classroom.create({
        name, teacher, students, schedule
    })

    res.status(200).json({
        success: true,
        data: classData
    })
})

const assignTeacher = catchAsyncError(async (req, res, next) => {
    const { classroomId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId || !classroomId)
        return next(new ErrorHandler('Missing required fields', 400));

    const teacher = await User.findOne({ _id: teacherId, role: "Teacher" });
    if (!teacher)
        return next(new ErrorHandler('Teacher not found', 400))

    const classroom = await Classroom.findById(classroomId);
    if (!classroom)
        return next(new ErrorHandler('Classroom was not found', 400))

    classroom.teacher = teacher;
    await classroom.save();

    return res.status(200).json({
        success: true,
        message: "Successfully updated"
    })
})

const assignStudents = catchAsyncError(async (req, res, next) => {
    const { classroomId } = req.params;
    let { studentIds } = req.body;
    if (!classroomId || !studentIds || !studentIds.length)
        return next(new ErrorHandler("Missing required feilds"));

    studentIds = [...(new Set(studentIds))];
    const validStudents = await User.find({
        _id: { $in: studentIds },
        role: "Student"
    }).select('_id');

    if (validStudents.length !== studentIds.length)
        return next(new ErrorHandler("One or more invalid student IDs", 400));

    const classroom = await Classroom.findById(classroomId);
    if (!classroom)
        return next(new ErrorHandler('Classroom was not found', 400))

    const existingStudents = new Set(classroom.students.map(id => id.toString()));
    const newStudents = validStudents.filter(student => !existingStudents.has(student._id.toString()));

    classroom.students.push(...newStudents.map(s => s._id));
    await classroom.save();

    return res.status(200).json({
        success: true,
        message: "Successfully updated"
    })
})

const getStudentList = catchAsyncError(async (req, res, next) => {
    const { classroomId } = req.params;

    if (!classroomId)
        return next(new ErrorHandler("Classroom is missing", 400));

    const studentList = await Classroom.findById(classroomId)
        .select('students').populate("students", "-password -role");
    if (!studentList)
        return next(new ErrorHandler("Classorom not found", 400))

    res.status(200).json({
        success: true,
        data: studentList
    })
})

module.exports = {
    getClassroom,
    createClassroom,
    assignTeacher,
    assignStudents,
    getStudentList
}