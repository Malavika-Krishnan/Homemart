import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Shopping List & Item API Suite (Issues #7 & #6)', () => {
  let userToken: string;

  beforeEach(async () => {
    const reg = await request(app).post('/api/v1/auth/register').send({
      name: 'Carol',
      email: 'carol@example.com',
      password: 'Password123!',
    });
    userToken = reg.body.data.token;

    await request(app)
      .post('/api/v1/families/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Carol Family' });
  });

  it('should create a new shopping list and add items to it', async () => {
    const listRes = await request(app)
      .post('/api/v1/lists')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Groceries', description: 'Weekly groceries' });

    expect(listRes.status).toBe(201);
    const listId = listRes.body.data._id;

    const itemRes = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        listId,
        name: 'Organic Milk',
        category: 'Dairy',
        quantity: 2,
        priority: 'HIGH',
      });

    expect(itemRes.status).toBe(201);
    expect(itemRes.body.data.name).toBe('Organic Milk');
    expect(itemRes.body.data.category).toBe('Dairy');
    expect(itemRes.body.data.priority).toBe('HIGH');
  });

  it('should toggle purchase status of an item', async () => {
    const listRes = await request(app)
      .post('/api/v1/lists')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Weekly Market' });

    const listId = listRes.body.data._id;

    const itemRes = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ listId, name: 'Apples', category: 'Produce' });

    const itemId = itemRes.body.data._id;

    const toggleRes = await request(app)
      .patch(`/api/v1/items/${itemId}/toggle-purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.isPurchased).toBe(true);
  });
});
