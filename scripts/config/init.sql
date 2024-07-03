create database planet;
create user planetuser with encrypted password 'password';
ALTER ROLE planetuser
	SUPERUSER
	CREATEDB
	CREATEROLE
	BYPASSRLS;
grant all privileges on database planet to planetuser;