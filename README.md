# BadinTransportation Using Django

Django transport-service prototype for Badin with rider registration, booking models, templates, and a web interface.

## Setup and repository reference

### Project structure

- [badin_transport](badin_transport)
- [db.sqlite3](db.sqlite3)
- [manage.py](manage.py)
- [requirements.txt](requirements.txt)
- [static](static)
- [templates](templates)
- [transport_app](transport_app)

### Getting started

```bash
git clone https://github.com/Raimal-Raja/BadinTransportation_Using_Django.git
cd BadinTransportation_Using_Django
```

Create and activate a virtual environment, then install the project dependencies:

```bash
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r "requirements.txt"
```

Run each Django project from the folder containing its manage.py file:

```bash
python manage.py check
python manage.py migrate
python manage.py runserver
```

### Configuration and limitations

Run migrations before starting the local Django server. Booking and rider-registration flows need separate browser verification; a Django system check does not verify complete trip or payment workflows.

### Validation

Recorded checks from the previous maintenance review (2026-10-08): 15 existing Python files passed syntax checks; changed files and new regression tests were checked separately. 7 JavaScript files passed node --check; JSX/TypeScript production builds were not run. Django system checks passed. Syntax checks do not establish full runtime correctness. External APIs, live scraping, GUI interaction, notebook training and production deployment were not comprehensively exercised.

### Contributions

Describe the issue, reproduction steps, environment, and expected behavior when proposing a change. Keep generated environments, credentials, and unnecessary build artifacts out of new commits.

### License

No top-level license file was found during this review.
