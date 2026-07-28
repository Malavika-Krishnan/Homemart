import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Offline Synchronization API Suite (Issue #4)', () => {
  let userToken: string;
  let listId: string;

  beforeEach(async () => {
    const reg = await request(app).post('/api/v1/auth/register').send({
      name: 'Dave',
      email: 'dave@example.com',
      password: 'Password123!',
    });
    userToken = reg.body.data.token;

    await request(app)
      .post('/api/v1/families/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Dave Family' });

    const listRes = await request(app)
      .post('/api/v1/lists')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Sync Test List' });

    listId = listRes.body.data._id;
  });

  it('should process batched offline item operations', async () => {
    const syncPayload = {
      clientTimestamp: new Date().toISOString(),
      operations: [
        {
          action: 'CREATE',
          entity: 'item',
          clientItemId: 'client-item-uuid-101',
          listId,
          clientTimestamp: new Date().toISOString(),
          data: {
            name: 'Offline Bread',
            category: 'Bakery',
            quantity: 1,
          },
        },
      ],
    };

    const res = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${userToken}`)
      .send(syncPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.processedCount).toBe(1);
    expect(res.body.data.results[0].status).toBe('SUCCESS');
  });
});
