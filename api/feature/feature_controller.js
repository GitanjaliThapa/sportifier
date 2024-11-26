const { roles } = require("../../utils/enums");
const { findFeatures, createFeature, findFeatureById, updateFeature, deleteFeature } = require("./feature_service");

// Get all features
async function getFeatures(req, res, next) {
    try {
        const features = await findFeatures();
        return res.status(200).json(features);
    } catch (err) {
        next(err);
    }
}

// Get a single feature by ID
async function getFeatureById(req, res, next) {
    try {
        const feature = await findFeatureById(req.params.id);
        if (feature) {
            return res.status(200).json(feature);
        }
        return res.status(404).json({ message: "Feature not found" });
    } catch (err) {
        next(err);
    }
}   

// Create a new feature
async function createNewFeature(req, res, next) {
    try {
        const newFeature = await createFeature(req.body);
        if (newFeature) {
            return res.status(201).json(newFeature);
        }
        return res.status(400).json({ message: "Failed to create feature" });
    } catch (err) {
        next(err);
    }
}

// Update a feature by ID
async function updateFeatureById(req, res, next) {
    try {
       
        const updatedFeature = await updateFeature(req.params.id, req.body)
        //console.log(updatedFeature)
        if (updatedFeature) {
            return res.status(200).json(updatedFeature);
        }
        return res.status(400).json({ message: "Failed to update feature" });
    } catch (err) {
        next(err);

    }
}

// Delete a feature by ID
async function deleteFeatureById(req, res, next) {
    try {
        const deletedFeature = await deleteFeature(req.params.id);
        if (deletedFeature) {
            return res.status(200).json({ message: "Feature deleted successfully" });
        }
        return res.status(404).json({ message: "Feature not found" });
    } catch (err) {
        next(err);
    }
}

module.exports = { getFeatures, getFeatureById, createNewFeature, updateFeatureById, deleteFeatureById };
