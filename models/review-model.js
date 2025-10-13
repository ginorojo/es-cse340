const pool = require('../database/');

async function addReview(inv_id, account_id, review_text) {
  try {
    const sql = `INSERT INTO review (inv_id, account_id, review_text) VALUES ($1, $2, $3) RETURNING *`;
    const data = await pool.query(sql, [inv_id, account_id, review_text]);
    return data.rows[0];
  } catch (error) {
    console.error("addReview error:", error);
    return null;
  }
}

async function getReviewsByInventory(inv_id) {
  try {
    const sql = `
      SELECT r.review_text, r.review_date, a.account_firstname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInventory error:", error);
    return [];
  }
}

module.exports = { addReview, getReviewsByInventory };
