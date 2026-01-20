# Customer Portal Test Credentials

## CONFIDENTIAL - Internal Use Only

This document contains test credentials for accessing the Customer Portal. These credentials are for testing, demonstration, and validation purposes only.

---

## Test Customer Account

### Login URL

```
https://[your-domain]/customer/login
```

### Credentials

**Email Address (Username):**
```
test.customer@example.com
```

**Password:**
```
CustomerPortal2026!
```

---

## Creating Additional Test Accounts

To create additional customer accounts for testing:

### Step 1: Create User in Supabase Auth

Use the Supabase dashboard or API to create a new authenticated user with an email and password.

### Step 2: Add User Profile

Insert a record into the `user_profiles` table:

```sql
INSERT INTO user_profiles (id, role)
VALUES ('[user-auth-id]', 'customer');
```

Where `[user-auth-id]` is the UUID returned from Supabase Auth when the user was created.

### Step 3: Link to Customer Record

Ensure the email address in the auth user matches an email in the `customers` table:

```sql
-- Verify customer exists
SELECT id, company_name, email
FROM customers
WHERE email = 'test.customer@example.com';

-- If customer doesn't exist, create one
INSERT INTO customers (company_name, email, status)
VALUES ('Test Company', 'test.customer@example.com', 'active');
```

---

## Security Notes

1. **Do Not Share Publicly:** These credentials are for internal testing only. Do not include them in public documentation, client-facing materials, or external communications.

2. **Change Before Production:** All test credentials must be removed or changed before deploying to production environments.

3. **Use Secure Passwords:** When creating real customer accounts, ensure passwords meet security requirements and are transmitted securely.

4. **Role Verification:** Always verify that the user's role in `user_profiles` matches their intended access level before granting credentials.

---

## Real Customer Onboarding Process

When onboarding actual customers:

1. Create user account via Supabase Auth with their business email
2. Insert user profile with `role = 'customer'`
3. Ensure customer record exists in `customers` table with matching email
4. Provide credentials to customer through secure channel (encrypted email, password manager, etc.)
5. Instruct customer to change password on first login if your system supports it

---

**Document Classification:** CONFIDENTIAL
**Last Updated:** January 2026
**Owner:** Technical Implementation Team
