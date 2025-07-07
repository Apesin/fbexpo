const config = require("./config")
const mongodb = require("mongodb");

const client = new mongodb.MongoClient(config.MONGODBURI);

let database = null;

async function initialize() {
    await client.connect();
    
    database = client.db(config.DB_NAME);
}

function getCollection(collectionName) {
    return database.collection(collectionName);
}

async function createView(viewName, sourceCollectionName, pipeline) {
    if (!database) {
        throw new Error("Database not initialized. Call initialize() first.");
    }

    // Create the view
    return await database.command({
        create: viewName,
        viewOn: sourceCollectionName,
        pipeline: pipeline,
    });
}
module.exports = {
    initialize,
    getCollection,
    createView
};

