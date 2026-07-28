import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Family Management API Suite (Issue #8)', () => {
  let user1Token: string;
  let user2Token: string;

  beforeEach(async () => {
    const reg1 = await request(app).post('/api/v1/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'Password123!',
    });
    user1Token = reg1.body.data.token;

    const reg2 = await request(app).post('/api/v1/auth/register').send({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'Password123!',
    });
    user2Token = reg2.body.data.token;
  });

  it('should allow user to create a family group', async () => {
    const res = await request(app)
      .post('/api/v1/families/create')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ name: 'The Smiths' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('The Smiths');
    expect(res.body.data.inviteCode).toBeDefined();
  });

  it('should allow second user to join family using permanent invite code', async () => {
    const famRes = await request(app)
      .post('/api/v1/families/create')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ name: 'The Smiths' });

    const inviteCode = famRes.body.data.inviteCode;

    const joinRes = await request(app)
      .post('/api/v1/families/join')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ inviteCode });

    expect(joinRes.status).toBe(200);
    expect(joinRes.body.success).toBe(true);
    expect(joinRes.body.data.members.length).toBe(2);
  });
});
