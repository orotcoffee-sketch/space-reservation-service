# Error Contract

Conceptual standard error shape (future):

- `timestamp`
- `status`
- `code`
- `message`
- `path`

Application-specific error codes: not defined yet.

Error messages exposed to clients must not reveal:

- stack traces,
- SQL details,
- passwords,
- tokens,
- internal filesystem paths.
