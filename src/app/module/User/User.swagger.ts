/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints related to user
 */

// Get users
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get users by admin
 *     tags: [User]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort users by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order for sorting users
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       201:
 *         description: If user retrieved successfully
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
 *                   example: User retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: email@example.com
 *                       contact_number:
 *                         type: string
 *                         example: 1234567890
 *                       profile_pic:
 *                         type: string
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: USER
 *                       status:
 *                         type: string
 *                         example: ACTIVE
 *                       created_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *
 *       401:
 *         description: If user is not authorized. only admin can get users
 *
 */
