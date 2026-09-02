const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Candidate',
  },
  location: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: function() {
      // Generate default avatar based on first name
      const firstName = this.fullName ? this.fullName.split(' ')[0] : 'User';
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
