import mongoose, { Schema } from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  designation: { type: String, required: true },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['single', 'married', 'widowed'],
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  salary: { type: Number, default: 0, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
