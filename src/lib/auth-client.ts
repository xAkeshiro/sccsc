"use client";

import { createAuthClient } from "better-auth/react";

// Same-origin: requests go to /api/auth on whatever host served the page.
export const authClient = createAuthClient();
