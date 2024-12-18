/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints related to authentication
 */

// Create User
/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: email@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               contact_number:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: If user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: email@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 1234567890
 *                     profile_pic:
 *                       type: string
 *                       example: null
 *                     role:
 *                       type: string
 *                       example: USER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: If request body is invalid
 *
 */
