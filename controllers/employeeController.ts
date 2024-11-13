import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Employee from '../models/Employee';
import User from '../models/User';

const addEmployee = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      role,
      dateOfBirth,
      maritalStatus,
      gender,
      employeeId,
      department,
      salary,
      password,
      designation,
    } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        success: false,
        error: 'user already registered in employment',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new User Object
    const newUser = await new User({
      firstName,
      middleName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Create new Employee Object

    const newEmployee = await new Employee({
      userId: savedUser._id,
      employeeId,
      dateOfBirth,
      gender,
      maritalStatus,
      department,
      designation,
      salary,
    });

    await newEmployee.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error Adding new Employee',
    });
    console.log('error adding new Employee', error);
  }
};

const getEmployees = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided

    const skip = (page - 1) * limit;

    // const departments = await Department.find().skip(skip).limit(limit);

    const employees = await Employee.find()
      .populate({
        path: 'userId',
        select: '-password', // Exclude the password from the populated userId field
      })
      .populate('department');
    // Get total count for calculating the total number of pages
    const totalCount = await Employee.countDocuments();

    // Calculate the total number of pages
    // const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: employees,
      totalCount,
      // totalPages,
      // currentPage: page,
      // pageSize: limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching departments',
    });
    console.log('Error fetching departments:', error);
  }
};

const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate({
        path: 'userId',
        select: '-password', // Exclude the password from the populated userId field
      })
      .populate('department');
    // Get total count for calculating the total numbe

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching employee',
    });
    console.log('Error fetching employee:', error);
  }
};
const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    firstName,
    middleName,
    lastName,
    email,
    role,
    dateOfBirth,
    maritalStatus,
    gender,
    employeeId,
    department,
    salary,
    designation,
    password,
    userId,
  } = req.body;

  try {
    const userParams = {
      firstName,
      middleName,
      lastName,
      email,
      role,
      ...(password && { password: await bcrypt.hash(password, 10) }),
    };
    await User.updateOne({ _id: userId }, { $set: userParams });

    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        employeeId,
        dateOfBirth,
        gender,
        maritalStatus,
        department,
        designation,
        salary,
      }
    )
      .populate({
        path: 'userId',
        select: '-password', // Exclude the password from the populated userId field
      })
      .populate('department');

    res.status(200).json({ success: true, updatedEmployee });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: 'error updating department' });
  }
};

// const deleteDepartment = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     await Department.findByIdAndDelete({ _id: id });
//     res.status(200).json({ success: true });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'error deleting department' });
//   }
// };

export { addEmployee, getEmployees, getEmployee, updateEmployee };
