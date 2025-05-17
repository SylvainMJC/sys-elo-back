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





