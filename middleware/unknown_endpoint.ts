import { Request, Response } from 'express';

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
export default unknownEndpoint;
