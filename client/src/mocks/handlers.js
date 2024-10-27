import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:5000/api/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ message: 'User created successfully' })
    );
  }),

  rest.post('http://localhost:5000/api/login', (req, res, ctx) => {
    return res(
      ctx.json({ token: 'fake-jwt-token' })
    );
  }),

  rest.get('http://localhost:5000/api/stock/:symbol', (req, res, ctx) => {
    return res(
      ctx.json({ openPrice: 150.25 })
    );
  })
];