import { TokenPayload } from "../../types/TokenPayload.ts";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}