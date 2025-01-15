
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(404).json({ error: 'Failed to fetch users' });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: 'Failed to fetch user' });
        }
    }

    
    async updateUser(req, res) {
        try {
            const updatedUser = await this.userService.updateUser(req.params.id, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(404).json({ error:  error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const deleteUser = await this.userService.deleteUser(req.params.id, req.body);
            res.status(200).json(deleteUser);
        } catch (error) {
            res.status(404).json({ error:  error.message });
        }
    }

    // Create a new user on API/register
    async createUser(req, res) {
        try {
            const newUser = await this.userService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(404).json({ error:  error.message });
        }
    }


}

module.exports = UserController;
