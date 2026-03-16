# Current endpoints (WIP)
http://localhost:8080

## GETs

### /api/users/me
Gets user data based on the login token

**Header**
```
Authorization: Bearer user_token
```
The user_token is from the POST login

### /api/favorites/me
Gets the favorite music tracks based on the logged in user

**Header**
```
Authorization: Bearer user_token
```

### /api/music/trending
Gets trending music from Spotify Web API

## POSTs

### /api/auth/register
Registers a new user + encrypts password

**Body**
**JSON**
```
{
  "username": "username",
  "email": "testemail@test.com",
  "password": "user_password",
  "birthDate": "YYYY-MM-DD"
}
```

### /api/auth/login
User login, returns a token

**Body**
**JSON**
```
{
  "email": "testemail@test.com",
  "password": "user_password"
}
```

### /api/favorites
Adds music track to the logged in user’s favorites

**Header**
```
Authorization: Bearer user_token
Content-Type: application/json
```
user_token is from POST login

**Body**
**JSON**
```
{
  "musicId": 3
}
```
