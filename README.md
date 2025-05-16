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
