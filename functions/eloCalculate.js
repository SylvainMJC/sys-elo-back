class EloCalculator {

        static calculateElo = (R1, R2, S1, S2) => {
        const K = 32;  // Constante K, typiquement 32 dans le système Elo
        const expectedScore1 = 1 / (1 + Math.pow(10, (R2 - R1) / 400));  // Score attendu pour le joueur 1
        const expectedScore2 = 1 / (1 + Math.pow(10, (R1 - R2) / 400));  // Score attendu pour le joueur 2
        
        // Calcul du changement de score Elo
        const newR1 = R1 + K * (S1 - expectedScore1);  // Nouveau Elo du joueur 1
        const newR2 = R2 + K * (S2 - expectedScore2);  // Nouveau Elo du joueur 2

        return { newR1, newR2 };
    };
}

module.exports = EloCalculator;
