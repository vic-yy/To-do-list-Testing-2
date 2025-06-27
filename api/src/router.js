const express = require('express');
const router = express.Router();

const memoController = require('./controllers/memoController');
const memosMiddleware = require('./middlewares/memosMiddleware');

router.post('/api/memos',  memosMiddleware.validateFieldTitle, memoController.createMemoSimulado);
router.get('/api/memos', memoController.getAllSimulado);
router.get('/api/memos/:id', memoController.getMemoById); 
router.delete('/api/memos/:id', memoController.deleteMemoSimulado);
router.put('/api/memos/:id',
    memosMiddleware.validateFieldTitle,
    memosMiddleware.validateFieldStatus, 
    memoController.updateMemoSimulado);

module.exports = router;