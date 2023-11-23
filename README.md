# THE BOSS

The Boss is a web application that provides user registration, login, and profile functionalities in both `dark` and `light` theme (system default ).

![index_dark](./assets/index/index_dark.png)

![index_light](./assets/index/index_light.png)

## Technologies Used

- Frontend: `HTML`, `CSS`, `JavaScript`, `jQuery`
- Backend: `PHP`, `MongoDB` and `MySQL` for user data storage, `Redis` for session management

## Features

### 1. USER REGISTRATION

To register a new user, the following steps are taken:

- **Frontend:** HTML form to collect user registration information (e.g., username, email, password).
- **Backend:**

  - Validate user input.
  - Hash the password using PHP's `password_hash` function.
  - Store user information in the MySQL as well as MongoDB database.

  ![dark_register](./assets/registration/dark_register.png)

  ![dark_register_success](./assets/registration/dark_register_success.png)

  ![register_mysql](./assets/registration/register_mysql.png)

  ![register_mongodb](./assets/registration/register_mongodb.png)

### 2. USER LOGIN

Users can log in to the application using the following process:

- **Frontend:** HTML form to collect login credentials (e.g., username/email and password).

- **Backend:**

  - Retrieve user information from MongoDB based on the provided username/email.
  - Verify the password using PHP's `password_verify` function.
  - If authentication is successful, generate an access token, store it in MongoDB, and return it to the client. The access token ( random string ) will be stored in redis and username will be stored in `localstorage`

    ![light_login](./assets/login/light_login.png)

    ![login_redis](./assets/login/login_redis.png)

### 3. USER PROFILE

The user profile page displays the user's details:

- **Frontend:** HTML page to display the user's profile information.

- **Backend:**
  - Check for the presence of a valid access token in the redis using browser's local storage values.
  - If the token is valid, fetch the user's details from MongoDB.
  - Display the user's details on the profile page.

![profile_before_update](./assets/profile/profile_before_update.png)

![profile_after_update](./assets/profile/profile_after_update.png)

![profile_mongodb](./assets/profile/profile_mongodb.png)

### 4. SESSION MANAGEMENT WITH REDIS

- Use Redis to store session information, including the username and access token.
- When a user logs in, store their access token in Redis with an expiration time.
- Use Redis to check the existence of a user's session before processing certain requests (e.g., profile access).

### before logging out

![localstorage_before](./assets/profile/logout/localstorage_before.png)

![redis_before_logout](./assets/profile/logout/redis_before_logout.png)

### after logging out

![localstorage_after](./assets/profile/logout/localstorage_after.png)

![redis_after_logout](./assets/profile/logout/redis_after_logout.png)
