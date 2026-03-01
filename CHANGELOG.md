# Changelog

## v0.0.2
- Replaced hardcoded frontend API and GitHub URLs with environment-based variables
- Updated auth, profile, feed, dashboard, and post creation components to use env endpoints
- Improved portability across local/staging/prod by centralizing URL configuration
- Switched backend CORS origin to `CORS_ORIGIN` environment variable

## v0.0.1
- Initial release
- Authentication system
- Post feed
- Profile system
