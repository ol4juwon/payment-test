"use strict"

const mongoose =  require("mongoose");

mongoose.set('debug', true);
const monogodbUrl = `${process.env.MONGODB_URL}?retryWrites=true`;

mongoose.connect(monogodbUrl,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:  true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("connected", () => {
    logger.info("Mongo connected");

})

db.on('error', (error) => {
    logger.error("An error occured", JSON.stringify(error))
    process.exit(1)
})