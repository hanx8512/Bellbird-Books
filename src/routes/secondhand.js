const express = require('express');
const router = express.Router();
const db = require('../db');

// US-BB-03 新增二手图书实体
router.post("/secondhand", async (req,res)=>{
    const {isbn,title,author,condition,cost_price,sell_price,shelf_location} = req.body;
    const stmt = db.prepare(`
        INSERT INTO books_secondhand
        (isbn,title,author,condition,cost_price,sell_price,shelf_location)
        VALUES (?,?,?,?,?,?,?)
    `);
    const result = stmt.run(isbn,title,author,condition,cost_price,sell_price,shelf_location);
    res.status(201).json({id: result.lastInsertRowid});
})

// US-BB-04 标记单本二手书售出锁定
router.patch("/secondhand/:bookId/sold", async (req,res)=>{
    const {bookId} = req.params;
    const stmt = db.prepare(`
        UPDATE books_secondhand SET is_sold=1 WHERE id=? AND is_sold=0
    `);
    const ret = stmt.run(bookId);
    if(ret.changes === 0){
        return res.status(400).json({msg:"该书不存在或者已经售出"});
    }
    return res.json({ok:true});
})

module.exports = router;
