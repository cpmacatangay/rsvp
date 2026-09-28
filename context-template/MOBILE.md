# Mobile App — {{PROJECT_NAME}}
> **Optional module.** Delete this file if the project has no mobile client.

**Project:** {{PROJECT_NAME}} · **Stack:** {{LANGUAGE}} · {{UI_FRAMEWORK}} · {{DI_LIB}} · {{HTTP_LIB}}
**Target:** {{PLATFORM}} {{API_LEVEL}}+ · **Version:** {{X.Y}} · **Status:** {{Draft}} · **Updated:** {{DATE}}

---

## 1. Architecture Overview

> **Fill:** Layering. *(example)*
> ```
> UI (Screens) → ViewModels → UseCases → Repositories → APIs ({{HTTP_LIB}})
>                                                     → Local Storage ({{ENCRYPTED_STORE}})
> ```

### Layer responsibilities

| Layer | Responsibility | Tech |
|---|---|---|
| UI | Stateless composables/views | {{UI_FRAMEWORK}} |
| ViewModels | Hold `{{StateFlow}}<UiState>`, call repos | {{DI_LIB}} |
| Domain | Pure functions (mirror server `lib/{{compute}}`) | plain {{LANGUAGE}} |
| Data/API | HTTP interfaces per server route file | {{HTTP_LIB}} |
| Data/Storage | Credentials/token encrypted at rest | {{ENCRYPTED_STORE}} |

### Dependency Injection
> **Fill:** Consistent with the server's DIP pattern (see `RULES.md §2.5`).

---

## 2. Auth Flow

> **Fill:** Token model, storage, injection, session restore. *(example)*
> 1. Login → server returns `{ user, token }`.
> 2. Token stored in encrypted storage (Keystore/Keychain-backed).
> 3. HTTP interceptor injects `Authorization: Bearer <token>`.
> 4. On launch, `/auth/me` rehydrates; on 401 redirect to login.

### Server changes required for mobile
> **Fill:** *(example)* middleware falls back to `Authorization` header; login/signup
> return token in body; longer token expiry.

---

## 3. Project Structure

> **Fill:** *(example)*
> ```
> {{MOBILE_DIR}}/
> └── app/src/main/.../{{package}}/
>     ├── MainActivity
>     ├── data/          # DTOs, APIs, repositories, local store
>     ├── domain/        # use cases
>     ├── ui/            # screens + components + theme
>     └── push/          # push service (optional)
> ```

---

## 4. Design System Port

> **Fill:** Map `DESIGN.md` tokens to platform tokens. *(delete if no design system)*

| Web token | Platform token | Value |
|---|---|---|
| Primary `{{#HEX}}` | `{{ColorScheme.primary}}` | `{{Color(0xFF...)}}` |
| Accent `{{#HEX}}` | `{{ColorScheme.secondary}}` | `{{Color(0xFF...)}}` |
| H1 {{34}}px | `{{Typography.headlineLarge}}` | {{34sp}} |

### Component Equivalents
> **Fill:** Web component → platform equivalent table.

---

## 5. Push Notifications

### Client side
> **Fill:** Messaging service, permission flow (OS version-specific), channel, foreground/background handling.

### Server side
> **Fill:** Device-token collection, push service, cron integration.

### Web client scope
> **Fill:** Whether the browser client also receives push, or email-only. *(delete if N/A)*

---

## 6. Business Logic Duplication

Per `RULES.md §3.4`, duplication across `client/`, `server/`, and `{{MOBILE_DIR}}/`
is explicitly allowed. Key duplications:

| Code | Server | Mobile |
|---|---|---|
| {{STATUS}} derivation | `lib/{{compute}}.js` | `domain/{{UseCase}}.{{ext}}` |
| Validation schemas | `schemas/*.js` | `data/model/*.{{ext}}` |

---

## 7. Testing Philosophy

> **Fill:** *(example)* Unit-test the pure domain logic only; skip UI/E2E for v1;
> manual smoke test on a real device.

---

## 8. Distribution

> **Fill:** Store vs sideload. Build/install commands. *(example)*
> ```bash
> ./gradlew assembleDebug
> adb install -r app/build/outputs/apk/debug/app-debug.apk
> ```

### Signing
> **Fill:** Signing config location (gitignored) and how to generate keys.

---

## 9. Environment Setup

```bash
# Prerequisites: {{SDK, versions, env vars}}
```

### Required files (gitignored)

| File | Purpose | Obtained from |
|---|---|---|
| {{google-services.json}} | push SDK init | {{console}} |
| {{server/firebase-service-account.json}} | server-side push send | {{console}} |
| {{key.properties}} | app signing | self-generated |
| {{server/.env}} | server secrets | copied from `.env.example` |
