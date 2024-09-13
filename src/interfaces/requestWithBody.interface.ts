import { type Request } from 'express';

interface RequestWithBody extends Request {
	body: { [key: string]: undefined };
}

export default RequestWithBody;
