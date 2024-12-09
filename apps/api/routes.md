## Generic routes

**GET /api/versions**

- returns the supported API versions

```json
{
    "bestVersion": "v1",
    "availableVersions": ["v1"]
}
```

## User routes

**GET /api/v1/user**

Get user information.
User identified by token in header

**GET /api/v1/user/bookings**

Get user all bookings.
User identified by token in header

**GET /api/v1/user/bookings/{id}**

Get details of booking with id `:id`.
User identified by token must be the owner of the booking

**DELETE /api/v1/user/bookings/{id}**

Delete booking with id `:id`.
User identified by token must be the owner of the booking.

**GET /api/v1/user/trips**

Get user all trips.
User identified by token in header.

**GET /api/v1/user/{id}**

Get user public profile with id `:id`

**PUT /api/v1/user/nickname**

Update user nickname.
User identified by token in header.

**PUT /api/v1/user/preferences**

Update user preferences.
User identified by token in header.

## Account routes

**GET /api/v1/account/isVerified**

Check if account is verified.

**POST /api/v1/account/verify**

Verify account with token in body.

**DELETE /api/v1/account**

Delete account.
User identified by token in header.
