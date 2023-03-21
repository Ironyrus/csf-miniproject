create database if not exists itineraryLogin;

use itineraryLogin;

create table loginData (
	email varchar(128) not null,
	password varchar(64) not null,
    
    primary key (email)
);