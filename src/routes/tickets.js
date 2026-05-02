const express = require('express');
const { Ticket, Reply, User } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/tickets - الطالب ينشئ طلب
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, type } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      type,
      UserId: req.user.id,
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tickets/my - الطالب يشوف طلباته
router.get('/my', authenticate, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Reply }],
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tickets - الأدمن يشوف كل الطلبات
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }, { model: Reply }],
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tickets/:id/status - الأدمن يغير الحالة
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    await ticket.update({ status });
    res.json({ message: 'Status updated', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tickets/:id/reply - الأدمن يرد
router.post('/:id/reply', authenticate, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const reply = await Reply.create({
      message,
      TicketId: req.params.id,
      UserId: req.user.id,
    });

    res.status(201).json({ message: 'Reply added', reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;