import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  preHandlerAsyncHookHandler
} from "fastify";
import { getFirebaseAuth } from "../firebase/admin.js";

export interface FirebaseRequestUser {
  uid: string;
  provider: string | null;
  chzzkChannelId: string | null;
  email: string | null;
}

export interface VerifiedFirebaseToken {
  uid: string;
  provider?: unknown;
  chzzkChannelId?: unknown;
  email?: unknown;
}

type VerifyFirebaseToken = (idToken: string) => Promise<VerifiedFirebaseToken>;

interface FirebaseTokenVerifier {
  verifyIdToken(
    idToken: string,
    checkRevoked?: boolean
  ): Promise<VerifiedFirebaseToken>;
}

declare module "fastify" {
  interface FastifyRequest {
    firebaseUser: FirebaseRequestUser | null;
  }
}

export async function registerFirebaseAuthentication(app: FastifyInstance) {
  app.decorateRequest("firebaseUser", null);
}

export const requireFirebaseUser = createFirebaseAuthPreHandler(
  verifyActiveFirebaseIdToken
);
export const requireFirebaseAdmin = createFirebaseAdminPreHandler();

export function createFirebaseAuthPreHandler(
  verifyToken: VerifyFirebaseToken = verifyActiveFirebaseIdToken
): preHandlerAsyncHookHandler {
  return async (request, reply) => {
    const idToken = extractBearerToken(request.headers.authorization);

    if (!idToken) {
      sendUnauthorized(reply);
      return;
    }

    try {
      const decodedToken = await verifyToken(idToken);

      request.firebaseUser = {
        uid: decodedToken.uid,
        provider: stringClaim(decodedToken.provider),
        chzzkChannelId: stringClaim(decodedToken.chzzkChannelId),
        email: stringClaim(decodedToken.email)
      };
    } catch (error) {
      request.log.warn({ err: error }, "Firebase ID token rejected");
      sendUnauthorized(reply);
    }
  };
}

export function createFirebaseAdminPreHandler(
  verifyToken: VerifyFirebaseToken = verifyActiveFirebaseIdToken,
  getAdminUids: () => ReadonlySet<string> = readAdminFirebaseUids
): preHandlerAsyncHookHandler {
  const authenticate = createFirebaseAuthPreHandler(verifyToken);

  return async (request, reply) => {
    await authenticate.call(request.server, request, reply);

    if (reply.sent || !request.firebaseUser) {
      return;
    }

    if (!getAdminUids().has(request.firebaseUser.uid)) {
      request.log.warn(
        { uid: request.firebaseUser.uid },
        "Firebase user denied administrator access"
      );
      await reply.code(403).send({ error: "Administrator access required" });
    }
  };
}

export function getRequiredFirebaseUser(request: FastifyRequest): FirebaseRequestUser {
  if (!request.firebaseUser) {
    throw new Error("Firebase authentication pre-handler was not applied");
  }

  return request.firebaseUser;
}

function extractBearerToken(authorization: string | undefined): string | null {
  if (!authorization) {
    return null;
  }

  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  return match?.[1] ?? null;
}

export async function verifyActiveFirebaseIdToken(
  idToken: string,
  verifier: FirebaseTokenVerifier = getFirebaseAuth()
): Promise<VerifiedFirebaseToken> {
  return verifier.verifyIdToken(idToken, true);
}

function stringClaim(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function sendUnauthorized(reply: FastifyReply) {
  return reply
    .code(401)
    .header("WWW-Authenticate", "Bearer")
    .send({ error: "Authentication required" });
}

function readAdminFirebaseUids(): ReadonlySet<string> {
  return new Set(
    (process.env.ADMIN_FIREBASE_UIDS ?? "")
      .split(",")
      .map((uid) => uid.trim())
      .filter(Boolean)
  );
}
