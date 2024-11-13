import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  departmentDescription: { type: String, required: true },

  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
