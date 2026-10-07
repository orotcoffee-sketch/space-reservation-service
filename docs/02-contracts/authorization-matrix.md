# Authorization Matrix

Registered members only: space browsing requires authentication in MVP. ADMIN reservation creation/editing is not part of MVP.

| Capability | Public | MEMBER | ADMIN |
|---|---:|---:|---:|
| Register MEMBER account | Yes | Yes/irrelevant | Yes/irrelevant |
| Login | Yes | Yes | Yes |
| View active spaces | No | Yes | Yes |
| View space detail | No | Yes | Yes |
| View space availability | No | Yes | Yes |
| Create reservation | No | Yes | No requirement |
| View own reservations | No | Yes | No requirement |
| Modify own reservation | No | Yes | No requirement |
| Cancel own reservation | No | Yes | No requirement |
| Create space | No | No | Yes |
| Modify space | No | No | Yes |
| Activate/deactivate space | No | No | Yes |
| View all spaces incl. inactive | No | No | Yes |
| View all reservations | No | No | Yes |

"No requirement" means the capability is not part of MVP; endpoints marked MEMBER in `api-contract.md` are not offered to ADMIN.

Failures: no/invalid/expired token → 401 `AUTH_REQUIRED`; authenticated with insufficient role → 403 `ACCESS_DENIED`.
