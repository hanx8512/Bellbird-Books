const request = require('supertest');
const app = require('../src/app');

describe('Second‑hand Book API Tests', () => {

  // 测试获取图书列表接口
  test('GET /api/books should return status 200 and array', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 测试新增图书接口
  test('POST /api/books can create new book record', async () => {
    const newBook = {
      title: "The Old Man and the Sea",
      author: "Ernest Hemingway",
      price: 12.50,
      condition: "good"
    };
    const res = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', newBook.title);
  });

  // 测试参数校验‑缺少title字段返回400
  test('POST /api/books without title returns 400 bad request', async () => {
    const badBook = {
      author: "Unknown",
      price: 5
    };
    const res = await request(app)
      .post('/api/books')
      .send(badBook);
    expect(res.statusCode).toBe(400);
  });

  // 测试404不存在路由
  test('GET /api/notexist should return 404', async () => {
    const res = await request(app).get('/api/notexist');
    expect(res.statusCode).toBe(404);
  });
});
