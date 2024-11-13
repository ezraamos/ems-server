import { Request, Response } from 'express';
import Department from '../models/Department';

const addDepartment = async (req: Request, res: Response) => {
  try {
    const newDepartment = await new Department(req.body);
    await newDepartment.save();
    res.status(200).json({ success: true, newDepartment });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error Adding new Department',
    });
    console.log('error adding new department', error);
  }
};

const getDepartments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided

    const skip = (page - 1) * limit;

    // const departments = await Department.find().skip(skip).limit(limit);

    const departments = await Department.find();
    // Get total count for calculating the total number of pages
    const totalCount = await Department.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: departments,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching departments',
    });
    console.log('Error fetching departments:', error);
  }
};

const getDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    res.status(200).json({
      success: true,
      department: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching department',
    });
    console.log('Error fetching department:', error);
  }
};

const editDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { departmentName, departmentDescription } = req.body;

  try {
    const department = await Department.findByIdAndUpdate(
      { _id: id },
      {
        departmentName,
        departmentDescription,
      }
    );

    res.status(200).json({ success: true, department });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'error updating department' });
  }
};

const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Department.findByIdAndDelete({ _id: id });
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'error deleting department' });
  }
};

export {
  addDepartment,
  getDepartments,
  getDepartment,
  editDepartment,
  deleteDepartment,
};
