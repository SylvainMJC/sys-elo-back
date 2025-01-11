class statusController {
    constructor(statusService) {
        this.statusService = statusService;
    }

    async getAllStatuses(req, res) {
        try {
            const statuses = await this.statusService.getAllStatuses();
            res.status(200).json(statuses);
        } catch (error) {
            res.status(400).json({ error: 'Failed to fetch statues' });
        }
    }
    
    async getStatusById(req, res) {
        try {
            const status = await this.statusService.getStatusById(req.params.id);
            if (!status) {
                return res.status(404).json({ error: 'Status not found' });
            } 
            res.status(200).json(status);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createStatus(req, res) {
        try {
            const status = await this.statusService.createStatus(req.body);
            res.status(201).json(status);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const updatedStatus = await this.statusService.updateStatus(req.params.id, req.body);
            if (updatedStatus) {
                res.status(200).json(updatedStatus);
            } else {
                res.status(404).json({ error: 'Status not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteStatus(req, res) {
        try {
            const deleted = await this.statusService.deleteStatus(req.params.id);
            if (deleted) {
                res.status(204).send('Status deleted');
            } else {
                res.status(404).json({ error: 'Status not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = statusController;