
class MatchService {

    constructor(MatchModel) {
        this.Match = MatchModel;
        console.log(this.Match, 'this.Match constructor' )
    }


    async createMatch(data) {
        try {
            console.log('Creating match with data:', data);
            return await this.Match.create(data);
        } catch (error) {
            throw new Error(`Error creating match: ${error.message}`);
        }
    }
    

    async getMatches() {
        try {
            return await this.Match.findAll();
        } catch (error) {
            throw new Error(`Error fetching all matches: ${error.message}`);
        }
    }

    async getMatchById(id) {
        if (!id) {
            return null;
        }
        try {
            return await this.Match.findByPk(id);
        } catch (error) {
            throw new Error(`Error fetching match with ID ${id}: ${error.message}`);
        }
    }

    async updateMatch(id, data) {
        if (!id) {
            return null;
        }
        try {
            const match = await this.Match.findByPk(id);
            if (!match) {
                return null;
            }
            return await match.update(data);
        } catch (error) {
            throw new Error(`Error updating match with ID ${id}: ${error.message}`);
        }
    }

    async deleteMatch(id) {
        if (!id) {
            return null;
        }
        try {
            const match = await this.Match.findByPk(id);
            if (!match) {
                return null;
            }
            return await match.destroy();
        } catch (error) {
            throw new Error(`Error deleting match with ID ${id}: ${error.message}`);
        }
    }
}

module.exports = MatchService;