export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
  FRIENDS = 'FRIENDS_SERVICE',
  REFRESH_TOKEN = 'REFRESH_TOKEN_SERVICE',
  REVIEWS = 'REVIEWS_SERVICE',
  PLACES = 'PLACES_SERVICE',
  IMAGE_STORAGE = 'IMAGE_STORAGE_SERVICE',
  PROFILE = 'PROFILE_SERVICE',
  FAVOURITES = 'FAVOURITES_SERVICE',
  GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
  COMMENTS = 'COMMENTS_SERVICE',
  NEWSFEED = 'NEWSFEED_SERVICE',
  PLACE_IMAGES = 'PLACE_IMAGE_SERVICE',
  NOTIFICATION = 'NOTIFICATION',
  LIKES = 'LIKES'
}

export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  FRIENDS = 'friends',
  REVIEWS = 'reviews',
  PLACES = 'places',
  IMAGE_STORAGE = 'image-storage',
  FAVOURITES = 'favourites',
  COMMENTS = 'comments',
  NEWSFEED = 'newsfeed',
  NOTIFICATION = 'notification'
}

export enum ServerEvents {
  REVIEW_CREATE = 'review.create',
  REVIEW_DELETE = 'review.delete',
  FRIEND_REVIEW = 'friend.review',
  FRIEND_REQUEST = 'friend.request',
  FRIEND_RESPONSE = 'friend.response'
}

export enum WebsocketEvents {}
export enum Action {
  POST = 'POST',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}
export enum StatusCode {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED'
}
