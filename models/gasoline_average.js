const mongoose = require('mongoose');

const gasoline_averageSchema = new mongoose.Schema(
  {
    exeTime: {
      type: Date,
      require: true,
      unique: true,
    },
    rows: {
      type: Object,
      required: true,
      // unique: true,
    },
    TBL: {
      // type: String,
      type: Object,
      required: true,
    },
  },
  // ↓取得したいcollection名を指定する必要あり！！！
  {
    collection: 'gasoline_average',
  },
);

module.exports = mongoose.model('gasoline_average', gasoline_averageSchema);