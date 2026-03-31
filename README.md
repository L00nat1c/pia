
# Play It Again

## Front-End Steps

The Front-End is currently using React Native with the Expo framework. To test the front end with your own iPhone,
follow the steps below.

1. Install Expo Go on iPhone
2. Clone GitHub Repo on computer
   `git clone https://github.com/L00nat1c/pia.git`
3. Go into /pia/react-native-frontend folder
   `cd pia/react-native-frontend`
4. Install the dependencies
   `npm install`
5. Run the Expo project
   `npx expo start`
6. Terminal will run the project (make sure it stays running in terminal) and display QR code
7. Scan QR code with phone camera and it will display app on phone (no XCode needed!)


## Spring Boot Back-End Steps

Back-End is using a Spring Boot application to run CRUD operations.

1. Clone the repository onto your computer
2. Go to the directory that contains the "pom.xml" file and open a powershell terminal.
3. Run “./mvnw clean install” to install necessary files
4. Run “./mvnw clean spring-boot:run” to launch the application

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

### /api/music/search?q=(example search)
Gets a list of search results from Spotify API

### /api/music/db/{musicId}
Gets music data from database

### /api/music/spotify/{spotifyId}
Gets track data from Spotify API (Needs Spotify Id)

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

### /api/lastfm/track
Gets track data from Last.fm API
(Needs JWT login in current state)

**Body**
**JSON**
```
{
  "artist": "Radiohead",
  "track": "Creep"
}
```

### /api/deezer/track
Gets track preview url from Deezer
(Needs JWT login in current state)

**Body**
**JSON**
```
{
  "artist": "Radiohead",
  "track": "Creep"
}
```

### /api/music/enrich
Gets track data from all 3 APIs and stores it in the database
Also returns a JSON of the track
(Needs JWT login)

**Body**
**JSON**
```
{
  "artist": "Radiohead",
  "track": "Creep"
}
```