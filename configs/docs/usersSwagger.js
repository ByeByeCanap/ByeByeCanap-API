/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickName
 *               - lastName
 *               - firstName
 *               - userType
 *               - birthdate
 *               - gender
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nickName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               userType:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example: { result: 'User has been successfully created', token : token }
 *       400:
 *         content:
 *           application/json:
 *             example: { result: 'Cannot create an user, Missing or empty fields' }
 *       409:
 *         content:
 *           application/json:
 *             example: { result: 'User with the same email address or/and with the same Username already exist' }
 *       500:
 *         content:
 *           application/json:
 *             example: { result: 'Cannot create a user, Server error' }
 */

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Connect with email/password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example: { result: Connection successful, userType: userType, token: token  }
 *
 *       400:
 *         description: Connection failed, Missing or empty fields
 *         content:
 *           application/json:
 *             example: { result: 'Connection failed, Missing or empty fields' }
 *       401:
 *         content:
 *           application/json:
 *             example: { result: 'Connection failed, User not found or wrong password' }
 */

/**
 * @swagger
 * /users/{token}:
 *   get:
 *     summary: Retrieve user information by token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token associated with the user.
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 # Add other user properties as needed
 *             example:
 *               _id: "60d0fe4f5311236168a109ca"
 *               AllUserInfos: "UserInfos"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example: { message: "User has not been found !" }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: { message: "Internal server error" }
 */
