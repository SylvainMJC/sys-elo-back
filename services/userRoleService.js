class UserRoleService {
    
    constructor(userRoleModel) {
        this.userRole = userRoleModel;
    }

    async getAllUserRoles() {
        return this.userRole.getAllUserRoles();
    }

    async getUserRolesById(userId) {
        return this.userRole.getUserRoles(userId);
    }

    async createUserRole(data) {
        return this.userRole.addUserRole(data);
    }

    async updateUserRole(userId, data) {
        return this.userRole.updateUserRole(userId, data);
    }

    async deleteUserRole(userId) {
        return this.userRole.deleteUserRole(userId);
    }
}

module.exports = UserRoleService;