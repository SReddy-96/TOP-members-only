# Members Only

Checking for password confirmation.

```js
app.post(
  '/create-user',
  body('password').isLength({ min: 5 }),
  body('passwordConfirmation').custom((value, { req }) => {
    return value === req.body.password;
  }),
  (req, res) => {
    // Handle request
  },
);
```

## Notes

- pages
  - index (showing message, names and dates are redacted if they are not a premium member)
  - sign-up (to sign up to site)
  - Login (to login).
  - join the club (they need to add a password to be upgraded to member premium)

Only show 'create new message if logged in'
If admin then show a delete button for messages.
