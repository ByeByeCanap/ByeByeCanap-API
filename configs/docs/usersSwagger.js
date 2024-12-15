/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - uid2Auth: []
 *     description: Retrieve the authenticated user's profile information using a valid token.
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               nickName: "Johnny"
 *               birthDate: "1990-05-15"
 *               gender: "Male"
 *               themesInterest: ["Technology", "Sports"]
 *               categoriesInterest: ["Science", "Art"]
 *               themesSkill: ["Programming", "Design"]
 *               categoriesSkill: ["Software Development", "Graphic Design"]
 *               motivations: "To learn and contribute."
 *               preferredGroupType: "Small teams"
 *               preferredPeople: "Creative individuals"
 *               availability: "Weekends"
 *               locationPreference: "Remote"
 *               personalValues: ["Integrity", "Curiosity"]
 *               causes: ["Education", "Environment"]
 *               suggestions: "More tech meetups"
 *               descriptionProfile: "Passionate developer and designer."
 *       401:
 *         description: Unauthorized, no token provided or invalid token
 *         content:
 *           application/json:
 *             example: { result: 'Unauthorized, No token provided or invalid token' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: { result: 'Internal server error' }
 */

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
 *               birthdate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example: { result: 'User has been successfully created' }
 *       400:
 *         content:
 *           application/json:
 *             example: { result: 'Cannot create an user, Missing or empty fields' }
 *       409:
 *         content:
 *           application/json:
 *             example: { result: 'User with the same email address or/and with the same Username already exist' }
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
 *             example: { result: 'Connection successful' }
 *
 *       400:
 *         description: Connection failed, Missing or empty fields
 *         content:
 *           application/json:
 *             example: { result: 'Connection failed, Missing or empty fields' }
 *       401:
 *         content:
 *           application/json:
 *             example: { result: 'User not found or wrong password' }
 */

/**
 * @swagger
 * /users/update/personnalInfos:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - uid2Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The user's first name."
 *               lastName:
 *                 type: string
 *                 description: "The user's last name."
 *               nickName:
 *                 type: string
 *                 description: "The user's nickname."
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: "The user's birth date (YYYY-MM-DD)."
 *               gender:
 *                 type: string
 *                 description: "The user's gender."
 *               themesInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Themes the user is interested in."
 *               categoriesInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Categories the user is interested in."
 *               themesSkill:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Themes related to the user's skills."
 *               categoriesSkill:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Categories related to the user's skills."
 *               motivations:
 *                 type: string
 *                 description: "The user's motivations."
 *               preferredGroupType:
 *                 type: string
 *                 description: "The user's preferred group type."
 *               preferredPeople:
 *                 type: string
 *                 description: "The user's preferred type of people."
 *               availability:
 *                 type: string
 *                 description: "The user's availability."
 *               locationPreference:
 *                 type: string
 *                 description: "The user's location preference."
 *               personalValues:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "The user's personal values."
 *               causes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Causes the user supports."
 *               suggestions:
 *                 type: string
 *                 description: "Suggestions or feedback from the user."
 *               descriptionProfile:
 *                 type: string
 *                 description: "A brief description of the user's profile."
 *     responses:
 *       200:
 *         description: User profile successfully updated
 *         content:
 *           application/json:
 *             example: { result: 'User profile successfully updated' }
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             example: { result: 'Bad request, missing or invalid fields' }
 *       401:
 *         description: Unauthorized, no token provided
 *         content:
 *           application/json:
 *             example: { result: 'Unauthorized, No token provided' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: { result: 'Internal server error' }
 */

/**
 * @swagger
 * /users/update/credentialInfos:
 *   put:
 *     summary: Update user credentials (email or password)
 *     tags: [Users]
 *     security:
 *       - uid2Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "New email address for the user."
 *               password:
 *                 type: string
 *                 description: "New password for the user."
 *     responses:
 *       200:
 *         description: User credentials successfully updated
 *         content:
 *           application/json:
 *             example: { result: 'User profile successfully updated' }
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             example: { result: 'Bad request, missing or invalid fields' }
 *       401:
 *         description: Unauthorized, no token provided
 *         content:
 *           application/json:
 *             example: { result: 'Unauthorized, No token provided' }
 *       409:
 *         description: Conflict, new email or password is the same as the current one
 *         content:
 *           application/json:
 *             example: { result: 'The new email or password must be different from the current one.' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: { result: 'Internal server error' }
 */
