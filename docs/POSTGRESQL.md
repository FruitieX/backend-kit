# Troubleshooting PostegreSQL connection errors

This applies especially for Ubuntu/Debian users, as the default PostgreSQL
config forbids logins as the `postgres` user. If granting all local UNIX
users access to the DB is not of concern, follow these steps:

Fixing `FATAL: Peer authentication failed for user "postgres"`:

* Edit your `/etc/postgresql/<version>/main/pg_hba.conf`

* Locate and edit the following lines (some of them may be missing):

  ```
  local   all             postgres                                [METHOD]
  local   all             all                                     [METHOD]
  host    all             all             127.0.0.1/32            [METHOD]
  host    all             all             ::1/128                 [METHOD]
  ```

* Allow all local connections by changing `[METHOD]` to `trust`, example:

  ```
  host    all             all             127.0.0.1/32            trust
  ```

* After this, reload the config by restarting the PostgreSQL service (on
  Debian/Ubuntu):

  ```
  sudo systemctl restart postgresql.service
  ```
