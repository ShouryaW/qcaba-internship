import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberships: [
    {
      type: String,  // e.g., "Regular", "Student"
      purchasedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }
  ]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
