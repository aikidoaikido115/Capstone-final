DROP SCHEMA IF EXISTS Anime_ACS;
CREATE SCHEMA Anime_ACS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Anime_ACS;



##############################Webpage Zone##############################


CREATE TABLE genre(
	genre_id INT NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(50),
    PRIMARY KEY (genre_id)
);



CREATE TABLE studio(
	studio_id INT NOT NULL AUTO_INCREMENT,
    studio_name VARCHAR(30),
    PRIMARY KEY (studio_id)
);


CREATE TABLE anime(
	anime_id INT NOT NULL AUTO_INCREMENT,
    genre_id INT,
    studio_id INT,
    premium_status BOOLEAN,
    title VARCHAR(100),
    description VARCHAR(15000),
    anime_image MEDIUMBLOB,
    big_image MEDIUMBLOB,
    release_date DATETIME,
    average_rating DECIMAL(2,1),
    sum_view INT,
    is_ended BOOLEAN,
    PRIMARY KEY (anime_id),
    CONSTRAINT `fk_anime_studio` FOREIGN KEY (studio_id) REFERENCES studio (studio_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE anime_genre(
	anime_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (anime_id, genre_id),
    CONSTRAINT `fk_anime_genre_anime` FOREIGN KEY (anime_id) REFERENCES anime (anime_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_anime_genre_genre` FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE episode(
	episode_id INT NOT NULL AUTO_INCREMENT,
    anime_id INT,
    episode_number INT,
    anime_file LONGBLOB,
    title VARCHAR(250),
    view INT,
    release_date DATETIME,
    PRIMARY KEY (episode_id),
    CONSTRAINT `fk_episode_anime` FOREIGN KEY (anime_id) REFERENCES anime (anime_id) ON DELETE RESTRICT ON UPDATE CASCADE
);
#####################################################################  

############################## user zone/premium ##############################

CREATE TABLE subscription_package(
	package_id INT NOT NULL AUTO_INCREMENT,
    package_name VARCHAR(100),
    package_length INT,
    price DECIMAL(6,2),
    PRIMARY KEY (package_id)
);

CREATE TABLE user(
	user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20),
    email VARCHAR(60),
    password VARCHAR(500),
    image MEDIUMBLOB,
    create_date DATETIME,
    subscription_status BOOLEAN,
    PRIMARY KEY (user_id)
);

CREATE TABLE admin(
	admin_id INT NOT NULL AUTO_INCREMENT,
    user_id  INT,
    username VARCHAR(20),
    PRIMARY KEY (admin_id),
    CONSTRAINT `fk_admin_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE subscription(
	subscription_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    package_id INT,
    start_date DATETIME,
    end_date DATETIME,
    PRIMARY KEY (subscription_id),
    CONSTRAINT `fk_subscription_subscription_package` FOREIGN KEY (package_id) REFERENCES subscription_package (package_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT `fk_subscription_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE to_watch_list(
	watch_list_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    anime_id INT,
    PRIMARY KEY (watch_list_id),
    CONSTRAINT `fk_to_watch_list_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT `fk_to_watch_list_anime` FOREIGN KEY (anime_id) REFERENCES anime (anime_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `unique_to_watch_list` UNIQUE (user_id,anime_id)
);

CREATE TABLE history(
	history_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    anime_id INT,
    history_date DATETIME,
    PRIMARY KEY (history_id),
    CONSTRAINT `fk_history_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT `fk_history_anime` FOREIGN KEY (anime_id) REFERENCES anime (anime_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `unique_history` UNIQUE (user_id,anime_id)
);

CREATE TABLE comment(
	comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    episode_id INT,
    text VARCHAR(1000),
    comment_date DATETIME,
    like_ BOOLEAN,
    reply_count INT,
    PRIMARY KEY (comment_id),
    CONSTRAINT `fk_comment_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_comment_episode` FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE RESTRICT ON UPDATE CASCADE
    
);

CREATE TABLE comment_reply(
	reply_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    comment_id INT,
    text VARCHAR(1000),
    reply_date DATETIME,
    like_ BOOLEAN,
    PRIMARY KEY (reply_id),
    CONSTRAINT `fk_comment_reply_comment` FOREIGN KEY (comment_id) REFERENCES comment (comment_id) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE fly_comment(
	fly_comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    episode_id INT,
    text VARCHAR(80),
    episode_time_stamp VARCHAR(20),
    comment_date DATETIME,
    PRIMARY KEY (fly_comment_id),
    CONSTRAINT `fk_fly_comment_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_fly_comment_episode` FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE RESTRICT ON UPDATE CASCADE
);