import { TokenPayload } from "../../types/TokenPayload.ts";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}