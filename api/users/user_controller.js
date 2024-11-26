const { roles } = require("../../utils/enums");
const { find, createUser, findUserById, updateUser, deleteUser } = require("./user_service");

async function findUsers(req, res, next) {
    // console.log(req.user)
    const users = await find()//
    return res.status(200).json(users)

}
async function changeRole(req, res, next) {
    const userRole = req.user.role
    if (userRole !== roles.Admin)
        return res.status(403).json({ message: "not enough permission" })
    const { role } = req.body
    if (!role)
        return res.status(400).json({ message: "Role is required" })
    if (!Object.values(roles).includes(role))///
        return res.status(400).json({ message: "Invalid role" })

    const updatedUser = await updateUser(req.params.id, { role });
    if (updatedUser) {
        return res.status(200).json(updatedUser);
    }
    return res.status(400).json({ message: "Failed to update user" });

}



async function createNewUser(req, res, next) {
    try {
        const newUser = await createUser(req.body)
        if (newUser)
            return res.status(201).json(newUser)
        return res.status(400).json({ message: "failed to create a user" })

    }
    catch (err) {
        next(err)
    }
}

// Get a single user by ID
async function getUserById(req, res, next) {
    try {
        // console.log(req.params)
        const user = await findUserById(req.params.id);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        next(err);

    }
}

async function updateUserById(req, res, next) {
    try {
        const { role } = req.body
        //
        if (role)
            delete req.body.role // delete role key with its value
        //
        const updatedUser = await updateUser(req.params.id, req.body);
        if (updatedUser) {
            return res.status(200).json(updatedUser);
        }
        return res.status(400).json({ message: "Failed to update user" });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}

// Delete a user by ID
async function deleteUserById(req, res, next) {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (deletedUser) {
            return res.status(200).json({ message: "User deleted successfully" });
        }
        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        return res.status(500).json({ message: err.toString() });
    }
}


module.exports = {
    changeRole: changeRole,
    findUsers: findUsers,
    createNewUser: createNewUser,
    getUserById: getUserById,
    updateUserById: updateUserById,
    deleteUserById: deleteUserById
}