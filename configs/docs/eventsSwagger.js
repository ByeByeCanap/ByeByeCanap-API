/**
 * @swagger
 * /events/createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - uid2Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - theme
 *               - category
 *               - eventDate
 *               - sizeGroup
 *               - description
 *               - adress
 *               - zipcode
 *               - ageRange
 *               - gender
 *             properties:
 *               title:
 *                 type: string
 *               theme:
 *                 type: string
 *               category:
 *                 type: string
 *               reference:
 *                 type: string
 *               image:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               sizeGroup:
 *                 type: string
 *               description:
 *                 type: string
 *               adress:
 *                 type: string
 *               zipcode:
 *                 type: integer
 *               ageRange:
 *                 type: string
 *               gender:
 *                 type: string
 *               other:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             example: { message: "Event created successfully", newEvent: eventData }
 *       400:
 *         description: creation failed, Missing or empty fields
 *         content:
 *           application/json:
 *             example: { result: "Cannot create an event, Missing required fields" }
 *       401:
 *         description: Unauthorized Event creation
 *         content:
 *           application/json:
 *             example: { error: "You can't create an event if you are not logged" }
 *       404:
 *         description: event location not found
 *         content:
 *           application/json:
 *             example: { error: "Your zipcode and adress are maybe wrong please try to edit your locations informations" }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example: { message: "Server error, please try later.", error: "Error message" }
 */

/**
 * @swagger
 * /events/allEvents:
 *   get:
 *     summary: Get all curent events
 *     tags: [Events]
 *     security:
 *       - uid2Auth: []
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             example: { message: "Here's the list of the events 👇", result: [ ...events ] }
 *       401:
 *         description: Unauthorized acces
 *         content:
 *           application/json:
 *             example: { message: "You can't see the current event if you are not logged" }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Event not found" }
 */

/**
 * @swagger
 * /events/byTheme/{theme}:
 *   get:
 *     summary: Get events by theme
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *         description: The theme of the events.
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             example: [ ...events ]
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Event not found" }
 */

/**
 * @swagger
 * /events/byCategory/{category}:
 *   get:
 *     summary: Get events by category
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of the events.
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             example: [ ...events ]
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Event not found" }
 */

/**
 * @swagger
 * /events/byEventId/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event.
 *     responses:
 *       200:
 *         description: Event found
 *         content:
 *           application/json:
 *             example: { message: "Event found", result: { ...eventData } }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Event not found" }
 */

/**
 * @swagger
 * /events/updateById/{id}:
 *   put:
 *     summary: Update event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               theme:
 *                 type: string
 *               category:
 *                 type: string
 *               reference:
 *                 type: string
 *               image:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               sizeGroup:
 *                 type: string
 *               description:
 *                 type: string
 *               adress:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               ageRange:
 *                 type: string
 *               gender:
 *                 type: string
 *               other:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             example: { result: { ...updatedEventData } }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Item not found ⛔" }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example: { message: "Internal Server Error" }
 */

/**
 * @swagger
 * /events/deleteById/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event.
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             example: { message: "Event has been deleted ✅" }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example: { message: "Oof, we didn't find your events 🥹" }
 */
