# Backend Endpoints Needed

This document tracks all backend API endpoints required for the frontend implementation.

## Status Legend
- ✅ **Implemented** - Endpoint exists and is being used
- 🔨 **Needed** - Endpoint required for current features
- 📋 **Planned** - Endpoint for future features

---

## User Endpoints

### ✅ GET /api/users/me
**Purpose:** Get current authenticated user's data  
**Authentication:** Required (Bearer token)  
**Response:**
```json
{
  "userId": 1,
  "username": "string",
  "email": "string",
  "birthDate": "YYYY-MM-DD",
  "createdAt": "timestamp",
  "profile_picture": "url (optional)"
}
```
**Used in:** 
- [profile.tsx](../react-native-frontend/app/(tabs)/profile.tsx)
- [settings.tsx](../react-native-frontend/app/settings.tsx)

---

### 🔨 GET /api/users/{id}
**Purpose:** Get any user's public profile data  
**Authentication:** Required (Bearer token)  
**Path Parameters:**
- `id` - User ID

**Response:**
```json
{
  "userId": 1,
  "username": "string",
  "birthDate": "YYYY-MM-DD",
  "createdAt": "timestamp",
  "profile_picture": "url (optional)"
}
```
**Used in:** 
- [user/[id].tsx](../react-native-frontend/app/user/[id].tsx)
- Future: Friend profiles, search results

**Notes:** Should not return sensitive data (email, password)

---

### 🔨 GET /api/users/{id}/reviews
**Purpose:** Get all reviews created by a specific user  
**Authentication:** Required (Bearer token)  
**Path Parameters:**
- `id` - User ID

**Query Parameters (optional):**
- `limit` - Number of reviews to return (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "rating": 5,
    "reviewText": "string",
    "songTitle": "string",
    "songArtist": "string",
    "songImage": "url",
    "likes": 24,
    "comments": 8,
    "createdAt": "timestamp"
  }
]
```
**Used in:** 
- [profile.tsx](../react-native-frontend/app/(tabs)/profile.tsx) - Own reviews
- [user/[id].tsx](../react-native-frontend/app/user/[id].tsx) - Other users' reviews

---

### 📋 GET /api/users/me/friends
**Purpose:** Get authenticated user's friends list with current listening status  
**Authentication:** Required (Bearer token)  

**Response:**
```json
[
  {
    "userId": 2,
    "username": "string",
    "profile_picture": "url (optional)",
    "isListening": true,
    "currentSong": {
      "title": "string",
      "artist": "string",
      "albumCover": "url"
    } // null if not listening
  }
]
```
**Used in:** 
- [FriendsDrawer.tsx](../react-native-frontend/app/components/FriendsDrawer.tsx)
- Future: Friends list page

---

### 🔨 POST /api/users/change-password
**Purpose:** Change authenticated user's password  
**Authentication:** Required (Bearer token)  

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Validation error (password too short, etc.)
- `401` - Current password incorrect
- `401` - Invalid/expired token

**Used in:** 
- [settings.tsx](../react-native-frontend/app/settings.tsx)

---

### 📋 DELETE /api/users/me
**Purpose:** Delete authenticated user's account  
**Authentication:** Required (Bearer token)  

**Request Body (optional):**
```json
{
  "password": "string" // For confirmation
}
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

**Used in:** 
- [settings.tsx](../react-native-frontend/app/settings.tsx) (placeholder)

**Notes:** Should soft-delete or properly cascade delete all user data (reviews, favorites, playlists, etc.)

---

## Reviews Endpoints

### 📋 GET /api/users/{id}/favorites
**Purpose:** Get a user's favorite tracks/albums  
**Authentication:** Required (Bearer token)  
**Path Parameters:**
- `id` - User ID

**Response:**
```json
[
  {
    "id": 1,
    "songTitle": "string",
    "songArtist": "string",
    "songImage": "url",
    "addedAt": "timestamp"
  }
]
```
**Used in:** 
- [profile.tsx](../react-native-frontend/app/(tabs)/profile.tsx) - Favorites tab
- [user/[id].tsx](../react-native-frontend/app/user/[id].tsx) - Other users' favorites

---

### 📋 GET /api/users/{id}/following
**Purpose:** Get list of users that a specific user is following  
**Authentication:** Required (Bearer token)  
**Path Parameters:**
- `id` - User ID

**Response:**
```json
[
  {
    "userId": 3,
    "username": "string",
    "profile_picture": "url (optional)"
  }
]
```
**Used in:** 
- [profile.tsx](../react-native-frontend/app/(tabs)/profile.tsx) - Following section
- [user/[id].tsx](../react-native-frontend/app/user/[id].tsx) - Following section

**Notes:**
- Should return public following list
- Could implement privacy settings in future (hide following list)

---

### 📋 GET /api/users/{id}/playlists
**Purpose:** Get a user's playlists  
**Authentication:** Required (Bearer token)  
**Path Parameters:**
- `id` - User ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "trackCount": 10,
    "coverImage": "url (optional)",
    "createdAt": "timestamp"
  }
]
```
**Used in:** 
- [profile.tsx](../react-native-frontend/app/(tabs)/profile.tsx) - Playlists tab
- [user/[id].tsx](../react-native-frontend/app/user/[id].tsx) - Playlists tab

---

## Activity Feed Endpoints

### 📋 GET /api/activity/feed
**Purpose:** Get activity feed of friends' reviews  
**Authentication:** Required (Bearer token)  

**Query Parameters (optional):**
- `limit` - Number of items to return (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "username": "string",
    "profileImage": "url (optional)",
    "rating": 5,
    "songTitle": "string",
    "songArtist": "string",
    "songImage": "url",
    "reviewText": "string",
    "likes": 10,
    "comments": 3,
    "createdAt": "timestamp"
  }
]
```
**Used in:** 
- [activity.tsx](../react-native-frontend/app/(tabs)/activity.tsx)

---

## Search Endpoints

### 📋 GET /api/users/search
**Purpose:** Search for users by username  
**Authentication:** Required (Bearer token)  

**Query Parameters:**
- `q` - Search query string
- `limit` - Number of results (default: 20)

**Response:**
```json
[
  {
    "userId": 1,
    "username": "string",
    "profile_picture": "url (optional)",
    "createdAt": "timestamp"
  }
]
```
**Used in:** 
- Future: User search feature

---

## Notes for Backend Implementation

1. **Authentication:** All endpoints require JWT Bearer token in Authorization header
2. **Error Handling:** Return consistent error format:
   ```json
   {
     "error": "Error message",
     "code": "ERROR_CODE"
   }
   ```
3. **Pagination:** Use `limit` and `offset` query parameters for list endpoints
4. **CORS:** Enable CORS for React Native frontend
5. **Rate Limiting:** Consider implementing rate limiting on sensitive endpoints (change password, delete account)
6. **Profile Pictures:** Implement file upload endpoint for profile pictures
7. **Privacy:** Ensure users can only view public data of other users (no emails, etc.)

---

## Priority Order

**High Priority (Current Features):**
1. PUT /api/users/me - Update user profile (edit profile)
2. POST /api/users/upload-profile-picture - Profile picture upload
3. GET /api/users/{id} - View other users' profiles
4. GET /api/users/{id}/reviews - View user reviews
5. POST /api/users/change-password - Settings functionality

**Medium Priority:**
6. GET /api/users/{id}/following - View user's following list
7. GET /api/users/{id}/favorites - Profile favorites tab
8. GET /api/users/{id}/playlists - Profile playlists tab
9. GET /api/users/me/friends - Friends drawer
10. GET /api/activity/feed - Activity page

**Low Priority (Future Features):**
11. DELETE /api/users/me - Account deletion
12. GET /api/users/search - User search
