-- Create table
CREATE TABLE test_table(
	id int NOT NULL,
    name varchar(255) DEFAULT NULL,
    age int DEFAULT NULL,
    address varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Procedure
CREATE DEFINER=`root`@`%` PROCEDURE `insert_data`()
BEGIN
declare max_id int default 100;
declare i int default 1;
while i <= max_id do
insert into test_table (id, name, age, address) values (i, concat('Name', i), i % 100, concat('Address', i));
set i = i+1;
end while;
END