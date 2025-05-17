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


**REDIS**

creation d'un match 
```
POST http://localhost:3000/api/matches/id/start
``` 

check du redis 
```
redis-cli
HGETALL match:8
```

![image](https://github.com/user-attachments/assets/d830d7b7-a275-4fd6-95cd-170ffbe3b97d)


