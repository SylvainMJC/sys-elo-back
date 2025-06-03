Backend

register
http://localhost:3000/api/register
body:
"username": "xxx"
"email": "mail",
"password": "pass"

login
http://localhost:3000/api/login
body:
"email": "mail",
"password": "pass"

logout
"message": "Vous êtes déconnecté"


create match
http://localhost:3000/api/matches/
body
{
    "player1": 4,
    "player2": 2,
    "statusName": "En attente"
}

---

How to run app :
npm run dev



actuellement le redis fonctionne en local avec uen aimge docker 

en cours les routes pour utiliser le redis en cours de test avec postman


## REDIS ##

### creation d'un match ###  
```
POST http://localhost:3000/api/matches/id/start
``` 

check du redis 
```
redis-cli
HGETALL match:8
```

![image](https://github.com/user-attachments/assets/d830d7b7-a275-4fd6-95cd-170ffbe3b97d)

### mise a jour d'un match ###
```
PATCh http://localhost:3000/api/matches/id/score
``` 

check du redis 
```
redis-cli
HGETALL match:8
```

![image](https://github.com/user-attachments/assets/33d1357c-4e09-4114-a9a7-b1ea1aef7b0c)

## fin d 'un match ##
```
POST http://localhost:3000/api/matches/8/end
```
check du redis 
```
redis-cli
HGETALL match:8
```
renvoie un tableau vide car le redis a été nettoyé:

![image](https://github.com/user-attachments/assets/97441c4d-5dbe-4bd1-9520-3cf5a2692ff9)

requete depuis postgres:

![image](https://github.com/user-attachments/assets/4fb5d7bf-ed1f-4015-960b-bfc6063b0e22)

Vérification de la postgres pour le match 8

```
GET http://localhost:3000/api/matches/8
```

resultat du get:
```
{
    "id": 8,
    "player1": {
        "id": "4",
        "username": "EmmaJones",
        "password": "password123",
        "email": "emma.jones@example.com",
        "elo": "1250",
        "created_at": "2025-01-01",
        "updated_at": "2025-01-01"
    },
    "player2": {
        "id": "5",
        "username": "WilliamGarcia",
        "password": "password123",
        "email": "william.garcia@example.com",
        "elo": "1500",
        "created_at": "2025-01-01",
        "updated_at": "2025-01-01"
    },
    "id_status": {
        "id": "3",
        "name": "Finished"
    },
    "created_at": "2025-05-17",
    "updated_at": "2025-05-17",
    "result_player1": 2,
    "result_player2": 10
}
``` 

### affichage du score penant la partie ###  
```
GET http://localhost:3000/api/matches/id/live
``` 

Affichage du score et du status

---

# Frontend - Interface de gestion des matchs en temps réel

## Installation et démarrage

### Prérequis
- Node.js 18+
- Angular CLI 17+
- Backend démarré sur localhost:3000
- Redis démarré (Docker ou local)

### Démarrage du Frontend
```bash
cd sys-elo-front
npm install
ng serve
```
Le frontend sera accessible sur `http://localhost:4200`

## Interface de gestion des matchs

### 1. Liste des matchs (`/matches`)
- Affiche tous les matchs avec leurs statuts
- **Bouton "View Match"** : Accède aux détails du match
- **Bouton "🔴 Live"** : Accès direct au mode live (visible pour matchs Pending/In Progress)

### 2. Détails d'un match (`/matches/:id`)
- Informations complètes du match
- Actions selon le statut :
  - **"Start Match"** (Pending) : Change le statut vers "In Progress"
  - **"Finish Match"** (In Progress) : Change le statut vers "Finished"
  - **"🔴 Live View"** : Accède à l'interface de gestion temps réel

### 3. Interface Live Match (`/matches/:id/live`)

#### Interface de contrôle en temps réel
- **Démarrage** : Bouton "🚀 Start Live Match" 
  - Initialise le match dans Redis
  - Change le statut en "In Progress"
  - Initialise les scores à 0-0

#### Gestion des points en temps réel
- **Tableau de scores** avec noms des joueurs
- **Boutons "+1 point"** pour chaque joueur
- **Scores mis à jour instantanément** dans Redis
- **Auto-refresh** toutes les 2 secondes
- **Indicateur LIVE** clignotant

#### Fin de match
- **Bouton "🏁 End Match"**
  - Sauvegarde les scores finaux en base de données
  - Nettoie les données Redis
  - Change le statut vers "Finished"
  - Redirige vers la page détails du match

## Flux d'utilisation complet

### Scénario type d'un match live

1. **Création du match**
   ```
   Aller sur /create-match
   → Sélectionner Player 1 et Player 2
   → Créer le match (statut: Pending)
   ```

2. **Accès au mode live**
   ```
   Option A: /matches → Cliquer "🔴 Live" 
   Option B: /matches/:id → Cliquer "🔴 Live View"
   → Accède à /matches/:id/live
   ```

3. **Démarrage du match live**
   ```
   Cliquer "🚀 Start Live Match"
   → POST /api/matches/:id/start
   → Redis initialisé avec scores 0-0
   → Statut: "In Progress"
   ```

4. **Gestion des points en temps réel**
   ```
   Cliquer "+1 point" pour Player 1 ou Player 2
   → PATCH /api/matches/:id/score
   → Mise à jour immédiate dans Redis
   → Interface se rafraîchit automatiquement
   ```

5. **Fin du match**
   ```
   Cliquer "🏁 End Match"
   → POST /api/matches/:id/end
   → Sauvegarde en PostgreSQL
   → Nettoyage Redis
   → Statut: "Finished"
   ```

## API Frontend - Service HTTP

### Méthodes disponibles
```typescript
 
Gestion classique des matchs
getAllMatches(): Observable<Object>
getOneMatch(matchId): Observable<Object>
createMatch(body): Observable<Object>
updateMatch(matchId, body): Observable<Object>
deleteMatch(matchId): Observable<Object>

Gestion Redis temps réel
startMatch(matchId, body): Observable<Object>          // POST /matches/:id/start
updateLiveScore(matchId, body): Observable<Object>     // PATCH /matches/:id/score  
getLiveMatchData(matchId): Observable<Object>          // GET /matches/:id/live
endMatch(matchId): Observable<Object>                  // POST /matches/:id/end
```

### Exemple d'utilisation
```typescript
Démarrer un match
this.httpService.startMatch(matchId, {
  result_player1: 0,
  result_player2: 0
}).subscribe(response => {
  console.log('Match started:', response);
});

Ajouter un point
this.httpService.updateLiveScore(matchId, {
  result_player1: 15,
  result_player2: 12  
}).subscribe(response => {
  console.log('Score updated:', response);
});
```

## Architecture technique

### Composants principaux
- **MatchesComponent** : Liste des matchs
- **MatchComponent** : Détails et actions du match  
- **LiveMatchComponent** : Interface de gestion temps réel

### Gestion des états
- **Auto-refresh** : Polling toutes les 2 secondes via `interval(2000)`
- **Gestion d'erreurs** : Arrêt automatique si match terminé
- **Navigation** : Retour automatique après fin de match

### Styles et UX
- **Indicateur Live** : Animation pulsante rouge
- **Scores** : Affichage grande taille, mise à jour fluide
- **Boutons** : Design cohérent avec code couleur (vert=start, rouge=live, bleu=actions)
- **Responsive** : Interface adaptée mobile/desktop

## Vérification et debug

### Côté Frontend
```bash
# Console du navigateur
F12 → Console → Vérifier les appels API
Network → Vérifier les requêtes HTTP
```

### Côté Backend  
```bash
# Logs du serveur
npm run dev → Vérifier les logs

# État Redis
redis-cli
HGETALL match:ID
KEYS match:*
```

### Tests manuels
1. Créer un match
2. Passer en mode live
3. Ajouter des points alternés
4. Vérifier l'auto-refresh
5. Terminer le match
6. Vérifier la sauvegarde en BDD





