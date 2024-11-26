const User = require("./user_model")

async function find(){
    const users = await User.find()
    return users
}

async function createUser(userData) {
    
        // Create a new user document
        const newUser = new User(userData);
        
        // Save the user to the database
        const savedUser = await newUser.save()//to run model(schema) validations as well

        // Return the saved user
        return savedUser;
    
}

// Find a user by ID
async function findUserById(userId) {
    const user = await User.findById(userId);
    return user;
}

async function findOne(query) {
    const user = await User.find(query);
    if (user.length>0)
    return user[0]
    return 
}

// Update a user by ID
async function updateUser(userId, updateData) {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return updatedUser;
}

// Delete a user by ID
async function deleteUser(userId) {
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
}



module.exports = {find,createUser,findUserById,updateUser,deleteUser,findOne}