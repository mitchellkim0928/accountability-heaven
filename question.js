var 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  QuestionSchema = new Schema({
    question_id: {type: String},
    text: {type: String},
    cadence: {type: Number}, 
    users: {type: [String]},
    answers: {type: [String]} 
  });

module.exports = mongoose.model("Question", QuestionSchema);
