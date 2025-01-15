const { Status } = require('../models/Status');

class StatusService {
    constructor(StatusModel) {
        this.Status = StatusModel;
    }

    async getAllStatuses() {
        return this.Status.findAll();
    }

    async getStatusById(id) {
        if (!id) {
        return null;
        }
        return this.Status.findByPk(id);
    }

    async createStatus(data) {
        return this.Status.create(data);
    }

    async updateStatus(id, data) {
        const status = await this.Status.findByPk(id);
        if (!status) {
            return null;
        }
        return status.update(data);
    }

    async deleteStatus(id) {
        const status = await this.Status.findByPk(id);
        if (!status) {
            return null;
        }
        return status.destroy();
    }
}

module.exports = StatusService;