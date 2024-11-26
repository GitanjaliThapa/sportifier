const Feature = require("./feature_model") // Assuming this is where your Feature model is defined

// Retrieve all features
async function findFeatures() {
    const features = await Feature.find()
    return features;
}

function watchFeatures(executeFn){
    const changeStream = Feature.watch()
    changeStream.on("change",async (change) => {
        executeFn()
       
    })
}

async function createFeature(featureData) {
    // Create a new feature document
    const newFeature = new Feature(featureData)

    // Save the feature to the database, running model validation
    const savedFeature = await newFeature.save()

    // Return the saved feature
    return savedFeature
}

// Find a feature by ID
async function findFeatureById(featureId) {
    const feature = await Feature.findById(featureId)
    return feature
}

// Find a single feature based on a query
async function findOneFeature(query) {
    const feature = await Feature.find(query)
    return feature.length > 0 ? feature[0] : null// Return the first matched feature or null
}


// Update a feature by ID
async function updateFeature(featureId, updateData) {
    //console.log(featureId,updateData)
    const updatedFeature = await Feature.findByIdAndUpdate(featureId, updateData, { new: true });
    return updatedFeature
}

// Delete a feature by ID
async function deleteFeature(featureId) {
    const deletedFeature = await Feature.findByIdAndDelete(featureId);
    return deletedFeature
}

module.exports = {
    findFeatures,
    createFeature,
    findFeatureById,
    findOneFeature,
    updateFeature,
    deleteFeature,
    watchFeatures
};
