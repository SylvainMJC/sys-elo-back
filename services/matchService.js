const User = require("../models/user");
const Status = require("../models/status");

const EloCalculator = require("../functions/eloCalculate");

class MatchService {

    constructor(MatchModel) {
        this.Match = MatchModel;
    }

    async createMatch(player1Id, player2Id, statusName) {
    
        try {
            const player1 = await User.findByPk(player1Id);
            const player2 = await User.findByPk(player2Id);
            const status = await Status.findOne({ where: { name: statusName } });
        
            if (!player1 || !player2) {
                throw new Error('Un ou plusieurs joueurs sont introuvables.');
            }

            if (!status) {
                throw new Error('Le statut spécifié est introuvable.');
            }

            const  match = await this.Match.create(
                {
                    player1: player1.id, 
                    player2: player2.id,
                    id_status: status.id,
                });




            return match
        }catch (error) {
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
                throw new Error(`Match with ID ${id} not found.`);
            }

            const { result_player1, result_player2, id_status } = data;



            if (typeof result_player1 !== 'number' || typeof result_player2 !== 'number') {
                throw new Error('Les résultats doivent être des nombres valides.');
            }



            if (result_player1=== undefined || result_player1 === undefined) {
                throw new Error(`Error updating match: result_player1 and result_player2 are required:  ${error.message}`);
            } 

            const player1 = await User.findByPk(match.player1);
            const player2 = await User.findByPk(match.player2);

            let elo1 = parseInt(player1.elo);
            let elo2 = parseInt(player2.elo);

            console.log("elo1",elo1, "elo2" , elo2);
            console.log(typeof(elo1), typeof(elo2));    

            if (isNaN(elo1) || isNaN(elo2)) {
                throw new Error('Les Elo des joueurs sont invalides.');
            }


            if (!player1 || !player2) {
                throw new Error('Un ou plusieurs joueurs sont introuvables.');
            }

            // Déterminer les résultats des joueurs
            let S1 = 0, S2 = 0;
            if (result_player1 > result_player2) {
                S1 = 1;  // joueur 1 gagne
                S2 = 0;  // joueur 2 perd
            } else if (result_player1 < result_player2) {
                S1 = 0;  // joueur 1 perd
                S2 = 1;  // joueur 2 gagne
            } else {
                S1 = 0.5; // match nul
                S2 = 0.5; // match nul
            }

            // Calculer les nouveaux Elo
            const { newR1, newR2 } = EloCalculator.calculateElo(elo1, elo2, S1, S2);

            // Mettre à jour les Elo des joueurs
            player1.elo = newR1;
            player2.elo = newR2;
            console.log(newR1, newR2);

            await player1.save();
            await player2.save();


            match.result_player1 = result_player1;
            match.result_player2 = result_player2;
            match.id_status = id_status;

            return await match.save();
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