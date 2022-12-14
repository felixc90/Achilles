const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'guildId' : String,
  'members' : [{
    'id' : String,
    'joinedAt' : Date,
    'totalExp' : Number,
    'mostRecentRunId' : String,
    'logEntries' : [{
        'logType' : String,
        'value' : Number,
        'dateStart' : Date,
        'dateEnd' : Date
    }]
  }],
})

module.exports = mongoose.model("Guild", schema)