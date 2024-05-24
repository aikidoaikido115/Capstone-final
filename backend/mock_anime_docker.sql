USE anime_acs;

SHOW VARIABLES LIKE 'max_allowed_packet';

SET global max_allowed_packet	 = 1073741824;


############################
####### DELETE ALL Anime Data
SET SQL_SAFE_UPDATES = 0;

#reset AUTO_INCREMENT
delete from anime_genre;
#Spacial
delete from comment_reply;
delete from comment;
delete from fly_comment;

delete from episode;
delete from to_watch_list;
delete from history;
delete from subscription;
delete from subscription_package;
delete from anime;
delete from studio;
delete from genre;
-- delete from premium_content;



ALTER TABLE comment_reply AUTO_INCREMENT = 1;
ALTER TABLE comment AUTO_INCREMENT = 1;
ALTER TABLE fly_comment AUTO_INCREMENT = 1;
ALTER TABLE genre AUTO_INCREMENT = 1;
-- ALTER TABLE premium_content AUTO_INCREMENT = 1;
ALTER TABLE to_watch_list AUTO_INCREMENT = 1;
ALTER TABLE history AUTO_INCREMENT = 1;
ALTER TABLE subscription_package AUTO_INCREMENT = 1;
ALTER TABLE subscription AUTO_INCREMENT = 1;
ALTER TABLE anime AUTO_INCREMENT = 1;
ALTER TABLE studio AUTO_INCREMENT = 1;
ALTER TABLE episode AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;

############################
####### DELETE ALL User/ Premium DATA
SET SQL_SAFE_UPDATES = 0;
delete from admin;
delete from user;
ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE admin AUTO_INCREMENT = 1;
SET SQL_SAFE_UPDATES = 1;


############################
#Anime Data

INSERT INTO genre (genre_name) VALUES
("Action"),
("Sci-fi"),
("Drama"),
("Psychological"),
("Comedy"),
("Parody"),
("Fantasy"),
("Yuri"),
("Herem"),
("Ecchi"),
("Shounen"),
("Shoujo"),
("Slice of life"),
("Isekai"),
("Mecha"),
("Romance"),
("Mahou shoujo"),
("Horror"),
("Supernatural"),
("Martial Arts"),
("Thriller"),
("Demon"),
("School"),
("Adventure");


INSERT INTO studio (studio_name)
VALUES ("Lerche"),
("P.A. Works"),
("feel."),
("TNK"),
("AIC Plus+"),
("Pierrot"),
("Bridge"),
("Studio Deen");

#intert Anime
INSERT INTO anime (genre_id, premium_status , studio_id, title, description, anime_image, big_image, release_date, average_rating, sum_view, is_ended)
VALUES (3, 0, 1, "Classroom of The Elite ss1", "On the surface, Koudo Ikusei Senior High School is a utopia. The students enjoy an unparalleled amount of freedom, and it is ranked highly in Japan. However, the reality is less than ideal. Four classes, A through D, are ranked in order of merit, and only the top classes receive favorable treatment", LOAD_FILE('/var/lib/mysql-files/anime_img/classroom of the elite.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_classroom.png'), NOW(), 8.7,0,0),
(4, 0, 1, "Classroom of The Elite ss1", "On the surface, Koudo Ikusei Senior High School is a utopia. The students enjoy an unparalleled amount of freedom, and it is ranked highly in Japan. However, the reality is less than ideal. Four classes, A through D, are ranked in order of merit, and only the top classes receive favorable treatment", LOAD_FILE('/var/lib/mysql-files/anime_img/classroom of the elite.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_classroom.png'), NOW(), 8.7,0,0),
(21, 0, 1, "Classroom of The Elite ss1", "On the surface, Koudo Ikusei Senior High School is a utopia. The students enjoy an unparalleled amount of freedom, and it is ranked highly in Japan. However, the reality is less than ideal. Four classes, A through D, are ranked in order of merit, and only the top classes receive favorable treatment", LOAD_FILE('/var/lib/mysql-files/anime_img/classroom of the elite.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_classroom.png'), NOW(), 8.7,0,0),
(23, 0, 1, "Classroom of The Elite ss1", "On the surface, Koudo Ikusei Senior High School is a utopia. The students enjoy an unparalleled amount of freedom, and it is ranked highly in Japan. However, the reality is less than ideal. Four classes, A through D, are ranked in order of merit, and only the top classes receive favorable treatment", LOAD_FILE('/var/lib/mysql-files/anime_img/classroom of the elite.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_classroom.png'), NOW(), 8.7,0,0),
(5, 0, 2, "Angel Beats!", "Death is one of many mysteries that has left humanity in the dark since the dawn of time", LOAD_FILE('/var/lib/mysql-files/anime_img/angel beats.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_angel.webp'), NOW(), 8.9,0,0),
(3, 0, 2, "Angel Beats!", "Death is one of many mysteries that has left humanity in the dark since the dawn of time", LOAD_FILE('/var/lib/mysql-files/anime_img/angel beats.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_angel.webp'), NOW(), 8.9,0,0),
(1,1,3,"Spy classroom ss1", "A decade ago, mankind witnessed the deadly potential of weapons caused by the Great War. To avoid another catastrophe, governments worldwide have resorted to espionage to fulfill their agendas", LOAD_FILE('/var/lib/mysql-files/anime_img/spy classroom.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_spy.png'), NOW(), 9.1,0,0),
(5,1,3,"Spy classroom ss1", "A decade ago, mankind witnessed the deadly potential of weapons caused by the Great War. To avoid another catastrophe, governments worldwide have resorted to espionage to fulfill their agendas", LOAD_FILE('/var/lib/mysql-files/anime_img/spy classroom.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_spy.png'), NOW(), 9.1,0,0),
(13,1,3,"Spy classroom ss1", "A decade ago, mankind witnessed the deadly potential of weapons caused by the Great War. To avoid another catastrophe, governments worldwide have resorted to espionage to fulfill their agendas", LOAD_FILE('/var/lib/mysql-files/anime_img/spy classroom.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_spy.png'), NOW(), 9.1,0,0),
(16,0,4,"School Days", "this is nice boat!", LOAD_FILE('/var/lib/mysql-files/anime_img/school day.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_school.jpg'), NOW(), 8.7,0,0),
(3,0,4,"School Days", "this is nice boat!", LOAD_FILE('/var/lib/mysql-files/anime_img/school day.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_school.jpg'), NOW(), 8.7,0,0),
(9,0,4,"School Days", "this is nice boat!", LOAD_FILE('/var/lib/mysql-files/anime_img/school day.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_school.jpg'), NOW(), 8.7,0,0),
(16,0,3,"Yosuga no sora", "Due to a sudden accident, twins Haruka and Sora Kasugano have lost both of their parents. Starting their lives anew, they return to their childhood home—living once again in the rural, quaint town like they did four years ago", LOAD_FILE('/var/lib/mysql-files/anime_img/yosuga no sora.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_sora.jpg'), NOW(), 8.4,0,0),
(3,0,3,"Yosuga no sora", "Due to a sudden accident, twins Haruka and Sora Kasugano have lost both of their parents. Starting their lives anew, they return to their childhood home—living once again in the rural, quaint town like they did four years ago", LOAD_FILE('/var/lib/mysql-files/anime_img/yosuga no sora.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_sora.jpg'), NOW(), 8.4,0,0),
(10,0,3,"Yosuga no sora", "Due to a sudden accident, twins Haruka and Sora Kasugano have lost both of their parents. Starting their lives anew, they return to their childhood home—living once again in the rural, quaint town like they did four years ago", LOAD_FILE('/var/lib/mysql-files/anime_img/yosuga no sora.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_sora.jpg'), NOW(), 8.4,0,0),
(9,0,5, "Date A Live ss1", "Thirty years ago, the Eurasian continent was devastated by a supermassive 'spatial quake'—a phenomenon involving space vibrations of unknown origin—resulting in the deaths of over 150 million people",LOAD_FILE("/var/lib/mysql-files/anime_img/date a live ss1.png"), LOAD_FILE('/var/lib/mysql-files/anime_big/big_date.jpg'), NOW(), 9.2,0,0),
(5,0,5, "Date A Live ss1", "Thirty years ago, the Eurasian continent was devastated by a supermassive 'spatial quake'—a phenomenon involving space vibrations of unknown origin—resulting in the deaths of over 150 million people",LOAD_FILE("/var/lib/mysql-files/anime_img/date a live ss1.png"), LOAD_FILE('/var/lib/mysql-files/anime_big/big_date.jpg'), NOW(), 9.2,0,0),
(16,0,5, "Date A Live ss1", "Thirty years ago, the Eurasian continent was devastated by a supermassive 'spatial quake'—a phenomenon involving space vibrations of unknown origin—resulting in the deaths of over 150 million people",LOAD_FILE("/var/lib/mysql-files/anime_img/date a live ss1.png"), LOAD_FILE('/var/lib/mysql-files/anime_big/big_date.jpg'), NOW(), 9.2,0,0),
(1,0,6, "Black clover ss1", "it just osu 7* jump beat map",LOAD_FILE('/var/lib/mysql-files/anime_img/black clover ss1.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_clover.jpg'), NOW(), 9.6,0,0),
(5,0,6, "Black clover ss1", "it just osu 7* jump beat map",LOAD_FILE('/var/lib/mysql-files/anime_img/black clover ss1.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_clover.jpg'), NOW(), 9.6,0,0),
(7,0,6, "Black clover ss1", "it just osu 7* jump beat map",LOAD_FILE('/var/lib/mysql-files/anime_img/black clover ss1.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_clover.jpg'), NOW(), 9.6,0,0),
(3,0,7, "Munou na Nana", "among us anime version",LOAD_FILE('/var/lib/mysql-files/anime_img/munou na nana.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_nana.jpg'), NOW(), 7.9,0,0),
(4,0,7, "Munou na Nana", "among us anime version",LOAD_FILE('/var/lib/mysql-files/anime_img/munou na nana.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_nana.jpg'), NOW(), 7.9,0,0),
(19,0,7, "Munou na Nana", "among us anime version",LOAD_FILE('/var/lib/mysql-files/anime_img/munou na nana.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_nana.jpg'), NOW(), 7.9,0,0),
(21,0,7, "Munou na Nana", "among us anime version",LOAD_FILE('/var/lib/mysql-files/anime_img/munou na nana.jpg'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_nana.jpg'), NOW(), 7.9,0,0),
(5,1,8, "KonoSuba ss1", "After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named Aqua",LOAD_FILE('/var/lib/mysql-files/anime_img/konosuba ss1.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_kono.jpg'), NOW(), 8.1,0,0),
(14,1,8, "KonoSuba ss1", "After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named Aqua",LOAD_FILE('/var/lib/mysql-files/anime_img/konosuba ss1.png'), LOAD_FILE('/var/lib/mysql-files/anime_big/big_kono.jpg'), NOW(), 8.1,0,0);



INSERT INTO anime_genre (anime_id, genre_id) VALUES
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1),3),
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1),4),
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1),21),
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1),23),
((SELECT anime_id from anime WHERE title = "Angel Beats!" LIMIT 1),5),
((SELECT anime_id from anime WHERE title = "Angel Beats!" LIMIT 1),3),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1),1),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1),5),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1),13),
((SELECT anime_id from anime WHERE title = "School Days" LIMIT 1),16),
((SELECT anime_id from anime WHERE title = "School Days" LIMIT 1),3),
((SELECT anime_id from anime WHERE title = "School Days" LIMIT 1),9),
((SELECT anime_id from anime WHERE title = "Yosuga no sora" LIMIT 1),16),
((SELECT anime_id from anime WHERE title = "Yosuga no sora" LIMIT 1),3),
((SELECT anime_id from anime WHERE title = "Yosuga no sora" LIMIT 1),10),
((SELECT anime_id from anime WHERE title = "Date A Live ss1" LIMIT 1),9),
((SELECT anime_id from anime WHERE title = "Date A Live ss1" LIMIT 1),5),
((SELECT anime_id from anime WHERE title = "Date A Live ss1" LIMIT 1),16),
((SELECT anime_id from anime WHERE title = "Black clover ss1" LIMIT 1),1),
((SELECT anime_id from anime WHERE title = "Black clover ss1" LIMIT 1),5),
((SELECT anime_id from anime WHERE title = "Black clover ss1" LIMIT 1),7),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1),3),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1),4),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1),19),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1),21),
((SELECT anime_id from anime WHERE title = "KonoSuba ss1" LIMIT 1),5),
((SELECT anime_id from anime WHERE title = "KonoSuba ss1" LIMIT 1),14);

INSERT INTO episode (anime_id, episode_number, anime_file, title, view, release_date) VALUES
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1),1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/classroom of the elite ss1 ep1.mp4'),"What is Evil? Whatever Springs from Weakness", 0, NOW()),
((SELECT anime_id from anime WHERE title = "Classroom of The Elite ss1" LIMIT 1), 2, LOAD_FILE('/var/lib/mysql-files/anime_mp4/classroom of the elite ss1 ep2.mp4'), "It Takes a Great Deal and Skill to Conceal One's Talent and Skill.", 0, NOW()),
((SELECT anime_id from anime WHERE title = "Angel Beats!" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/angel beats ep1.mp4'),"Departure" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep1.mp4'),"Mission: Flower Garden 1" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 2, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep2.mp4'),"Mission: Flower Garden 2" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 3, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep3.mp4'),"Mission: Flower Garden 3" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 4, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep4.mp4'),"File: Fool Erna" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 5, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep5.mp4'),"File: Lamplight Time" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 6, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep6.mp4'),"File: Pandemonium Sibylla" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 7, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep7.mp4'),"File: Meadow Sara" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 8, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep8.mp4'),"Mission: Daughter Dearest 1" ,0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 9, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep9.mp4'),"Mission: Daughter Dearest 2" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 10, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep10.mp4'),"Mission: Daughter Dearest 3" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 11, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep11.mp4'),"Mission: Daughter Dearest 4" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Spy classroom ss1" LIMIT 1), 12, LOAD_FILE('/var/lib/mysql-files/anime_mp4/spy classroom ss1 ep12.mp4'),"File: Daughter Dearest Grete" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "School Days" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/school days ep1.mp4'),"Confession" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Yosuga no sora" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/yosuga no sora ep1.mp4'),"Distant Memories" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Date A Live ss1" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/date a live ss1 ep1.mp4'),"April 10" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Black clover ss1" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/black clover ss1 ep1.mp4'),"Asta and Yuno" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/munou na nana ep1.mp4'),"Talentless" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "Munou na Nana" LIMIT 1), 2, LOAD_FILE('/var/lib/mysql-files/anime_mp4/munou na nana ep2.mp4'),"Time Traveler" , 0, NOW()),
((SELECT anime_id from anime WHERE title = "KonoSuba ss1" LIMIT 1), 1, LOAD_FILE('/var/lib/mysql-files/anime_mp4/konosuba ss1 ep1.mp4'),"lung Rerng" , 0, NOW());

############################



############################


INSERT INTO subscription_package (package_length, price, package_name) VALUES
(30, 68, "Anime battle pass Monthly"),
(90, 199, "Anime battle pass 3 Months"),
(365, 739, "Anime battle pass Annual");



SELECT "success!!!!";



