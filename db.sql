drop database if exists todo;

create database todo;

use todo;

create table task (
    id int primary key auto_increment,
    desciption varchar(255) not null
);

insert data task (desciption) values ('My test task');
insert data task (desciption) values ('My another task');