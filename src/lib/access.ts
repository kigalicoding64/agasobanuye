import { Movie, Subscription, Payment } from "@prisma/client";

type UserWithAccess = {
  id: string;
  subscription: Subscription | null;
  payments?: Payment[];
};

/**
 * Central access-control decision for whether a given user can stream a given movie.
 * This is the one place this rule should live - call it from both the watch page
 * (server-side redirect) and the video-serving API route (so the rule can't be bypassed
 * by hitting the API directly).
 */
export function canAccessMovie(
  user: UserWithAccess | null,
  movie: Pick<Movie, "isVip" | "isPpv" | "id">,
  ppvPayments?: Payment[]
): { allowed: boolean; reason?: "LOGIN_REQUIRED" | "SUBSCRIPTION_REQUIRED" | "PAYMENT_REQUIRED" } {
  // Fully free content - anyone can watch, including logged-out users (ads will show).
  if (!movie.isVip && !movie.isPpv) {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, reason: "LOGIN_REQUIRED" };
  }

  if (movie.isPpv) {
    const hasPaid = (ppvPayments ?? []).some(
      (p) => p.movieId === movie.id && p.status === "SUCCESS"
    );
    return hasPaid ? { allowed: true } : { allowed: false, reason: "PAYMENT_REQUIRED" };
  }

  // VIP / subscription-gated content.
  const sub = user.subscription;
  const isActive =
    sub?.status === "ACTIVE" && (!sub.expiresAt || new Date(sub.expiresAt) > new Date());

  return isActive ? { allowed: true } : { allowed: false, reason: "SUBSCRIPTION_REQUIRED" };
}

export function isSubscriptionActive(sub: Subscription | null) {
  if (!sub) return false;
  return sub.status === "ACTIVE" && (!sub.expiresAt || new Date(sub.expiresAt) > new Date());
}
